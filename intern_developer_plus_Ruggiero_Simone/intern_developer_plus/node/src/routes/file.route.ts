import express from 'express';
import multer from 'multer';
import path from 'path';
import ejs from 'ejs';
import fs from 'fs';
import { Pool } from 'pg';

let timestamp = 0;

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: '12345678',
  port: 5432, // change port
});

//Query di inizializzazione della tabella sul database
pool.query('CREATE TABLE IF NOT EXISTS file (timestamp INT, data TEXT)', (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Tabella file creata correttamente');
  }
});

//Utilizzo di multer per salvare il file caricato
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, './../../uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filePath = path.join(__dirname, './../../uploads/testocompleto.txt');
    fs.readFile(filePath, 'utf8', (err, oldText) => {
      if (err) {
        console.error('Errore nella lettura del file:', err);
        return;
      }
      if(req.file == undefined) return;
      fs.readFile(req.file.path, 'utf8', (err, newText) => {
        if (err) {
          console.error('Errore nella lettura del file:', err);
          return;
        }
        if (oldText != '') oldText = oldText + '\n';
        fs.writeFile(filePath, oldText + newText, (err) => {
          if (err) {
            console.error('Errore nella scrittura del file:', err);
            return;
          }
        });
      });
    });
    cb(null, 'testoscritto.txt');
  },
});

const upload = multer({ storage: storage });


const router = express.Router();

function createFileWithLines(): void {
  const filePath = path.join(__dirname, './../../text/testo.txt');
  const fileStream = fs.createWriteStream(filePath);
  const limit = Math.floor(Math.random() * 50) + 1;
  for (let i = 1; i <= limit; i++) {
      const line = `${Math.floor(Math.random() * 20) + 1} riga numero ${i}\n`;
      fileStream.write(line);
  }

  fileStream.end();
  console.log(`File creato con successo: ${filePath}`);
}

//POST creazione file da poter caricare
router.post('/createFile', (req, res) => { 
  createFileWithLines();
  res.send('Ricrea file');
});

// POST caricamento file
router.post('/importDataFromFile', (req, res) => {
  timestamp++;
  upload.single('inputFile')(req, res, (err) => {
    res.send('File caricato correttamente');
  });
});

// GET dati dal database
router.get('/data', (req, res) => {
  pool.query(
    'SELECT DISTINCT * FROM file WHERE timestamp >= $1 ORDER BY timestamp DESC LIMIT $2',
    [parseInt(req.query.from as string), parseInt(req.query.limit as string)],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Errore nel recupero dei dati dal database.');
      } else {
        const jsonData = result.rows;
        res.render('table', { jsonData });
      }
    }
  );
});

const filePath = './uploads/testocompleto.txt';
//GET dati non ancora caricati sul database in formato JSON
router.get('/pendingData', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Errore nella lettura del file:', err);
      res.status(500).send('Errore nella lettura del file.');
      return;
    }
    if(data == ''){
      res.json([]);
      return;
    }
    const lines = data.split('\n');
    const jsonData = lines.map((line) => {
      const [priorityStr, ...rest] = line.split(' ');
      const priority = parseInt(priorityStr, 10);
      data = rest.join(' ');
      return { priority, data };
    });

    res.json(jsonData);
  });
});

//Aggiornamento del database
function updateDB() {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Errore nella lettura del file:', err);
      return;
    }
    if (data != '') {
      const lines = data.split('\n');

      lines.sort((a, b) => {
        const num1 = parseInt(a, 10);
        const num2 = parseInt(b, 10);

        return num2 - num1;
      });
      let i = 0;
      let limit = lines.length > 15 ? 15 : lines.length;

      let linesCut: string[] = lines.map((stringa) => {
        const parti = stringa.split(' ');

        return parti.length >= 2 ? parti.slice(1).join(' ') : stringa;
      });

      while (i < limit) {
        pool.query(
          'INSERT INTO file (timestamp, data) VALUES ($1, $2)',
          [timestamp, linesCut[i]],
          (err, result) => {
            if (err) {
              console.error('Errore nella scrittura del file:', err);
              return;
            }
          }
        );
        i++;
      }
      fs.writeFile(filePath, lines.slice(15).join('\n'), (err) => {
        if (err) {
          console.error('Errore nella scrittura del file:', err);
          return;
        }

        console.log('File scritto correttamente');
      });
    }
  });
}

//Intervallo di tempo di 10 secondi
const intervallo = 10000;

//Chiamata della funzione che aggiorna il database eseguita ogni 10 secondi
setInterval(updateDB, intervallo);

export default router;
