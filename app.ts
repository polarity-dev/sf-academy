import express from 'express';
import bodyParser from 'body-parser';
import { generateRandomDataFile, delay } from './utils/functions';
import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';
import multer from 'multer';
import readline from 'readline';

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: 'uploads/' }); // Multer configuration

// Setting up the database connection and models is necessary here

const dbPool = new Pool({
  user: 'user', // same as POSTGRES_USER in docker-compose.yml
  host: 'db', // the service name of your database in docker-compose.yml
  database: 'dbname', // same as POSTGRES_DB in docker-compose.yml
  password: 'password', // same as POSTGRES_PASSWORD in docker-compose.yml
  port: 5432, // default PostgreSQL port
});

async function initializeDatabase() {
  const client = await dbPool.connect();
  try {
    // SQL query to create the 'pending_data' table if it does not exist
    const createPendingDataTableQuery = `
      CREATE TABLE IF NOT EXISTS pending_data (
        id SERIAL PRIMARY KEY,
        priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 5),
        data TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    // SQL query to create the 'processed_data' table if it does not exist
    const createProcessedDataTableQuery = `
      CREATE TABLE IF NOT EXISTS processed_data (
        id SERIAL PRIMARY KEY,
        data TEXT NOT NULL,
        processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createPendingDataTableQuery);
    await client.query(createProcessedDataTableQuery);
  } catch (error) {
    console.error('Failed to initialize the database:', error);
    throw error;
  } finally {
    client.release();
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/importDataFromFile', upload.single('datafile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileStream = fs.createReadStream(req.file.path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  try {
    await dbPool.connect();
    for await (const line of rl) {
      const [priority, data] = line.split(' ', 2);

      if (!priority || !data) {
        throw new Error('Invalid file format');
      }

      const query = 'INSERT INTO pending_data (priority, data) VALUES ($1, $2)';
      await dbPool.query(query, [parseInt(priority, 10), data]);
    }

    res.send('File processed and data imported successfully.');
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file.');
  } finally {
    fs.unlinkSync(req.file.path); // Clean up the uploaded file
    dbPool.end();
  }
});

app.get('/pendingData', async (req, res) => {
  try {
    const result = await dbPool.query('SELECT * FROM pending_data');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pending data:', error);
    res.status(500).send('Error fetching pending data');
  }
});

app.get('/data', async (req, res) => {
  try {
    const fromTimestamp = req.query.from;
    const limit = req.query.limit;

    let query = 'SELECT * FROM processed_data';
    const queryParams = [];

    if (fromTimestamp) {
      queryParams.push(fromTimestamp);
      query += ` WHERE processed_at >= $${queryParams.length}`;
    }

    query += ' ORDER BY processed_at';

    if (limit) {
      queryParams.push(limit);
      query += ` LIMIT $${queryParams.length}`;
    }

    const result = await dbPool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching processed data:', error);
    res.status(500).send('Error fetching processed data');
  }
});

const processImportQueue = async () => {
  while (true) {
    try {
      // Begin a transaction
      const client = await dbPool.connect();
      await client.query('BEGIN');

      // Fetch the top 15 unprocessed data items, prioritized by the highest priority first
      const fetchQuery = 'SELECT * FROM pending_data ORDER BY priority DESC, created_at LIMIT 15';
      const res = await client.query(fetchQuery);

      if (res.rows.length > 0) {
        const processedAt = new Date();

        for (const row of res.rows) {
          // Process each row (simulated here; you should replace this with your actual processing logic)
          console.log('Processing:', row.data);

          // Insert processed data into the processed_data table
          const insertQuery = 'INSERT INTO processed_data (data, processed_at) VALUES ($1, $2)';
          await client.query(insertQuery, [row.data, processedAt]);

          // Delete the processed row from pending_data
          const deleteQuery = 'DELETE FROM pending_data WHERE id = $1';
          await client.query(deleteQuery, [row.id]);
        }
      }

      // Commit the transaction
      await client.query('COMMIT');

      // Release the client back to the pool
      client.release();

    } catch (error) {
      console.error('Error processing import queue:', error);

      // In case of an error, roll back the transaction
      try {
        await dbPool.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }

    // Wait for 10 seconds before the next poll
    await delay(10000);
  }
};

const PORT = 3000;
initializeDatabase()
  .then(() => {
    // Start the polling service
    processImportQueue();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during server initialization:', error);
    process.exit(1);
  });