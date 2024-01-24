import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { Pool } from 'pg';





const app = express();
const port = 5000;
const uploadDir = 'uploads/';
let datas: Array<{ priority_data: number, message_data: string, timestamp_data : Date }> = [];
let isProcessing = false;

// Connect to the PostgreSQL database

const client = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'intern_developer_plus',
    password: 'mattia_123',
    port: 5432,
});

client.connect()
    .then(() => {
        console.log('Connesso al database PostgreSQL');
    }) .catch((err: any) => console.error('Errore di connessione al database', err));

// Crea la directory se non esiste
if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
}

// Multer configuration

const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: any) => {
        cb(null, uploadDir);
    },
    filename: (req: Request, file: any, cb: any) => {
        cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`);
    },
});

const upload = multer({ storage: storage }).single('file');



//functions

// Save the datas from the file to the database

const saveDatas = (file: any) => {
    const data = fs.readFileSync(`${uploadDir}${file.filename}`, 'utf8');
    let newDatas = data.split('\n');
    
   // Add the new datas to the existing datas array

    newDatas = newDatas.map((d) => d.replace(/\r$/, '')); // Remove the trailing '\r' from each data

    newDatas = newDatas.filter((d) => {
        const firstChar = d.charAt(0);
        return firstChar >= '1' && firstChar <= '5';
    });

    const dataObjects = newDatas.map((d) => {
        const priority_data = parseInt(d.charAt(0));
        const message_data = d.substring(2);
        const timestamp_data = new Date();
        
        return { priority_data, message_data, timestamp_data };
    });

    datas = datas.concat(dataObjects); 

    datas.sort((a, b) => b.priority_data - a.priority_data);
    
    // Sort the datas based on the first character in descending order

    if (isProcessing) {
        setTimeout(() => {
            let filesAtTheBeginning = fs.readdirSync(uploadDir).length;
            sendDatasToDatabase(filesAtTheBeginning);
        }, 10000); // 10-second timeout
    } else {
        let filesAtTheBeginning = fs.readdirSync(uploadDir).length;
        sendDatasToDatabase(filesAtTheBeginning);
    }
};



const sendDatasToDatabase = async (filesAtTheBeginning: number) => {

   
    
    if (datas.length === 0 ) {
        
        return true;
    }

    if (filesAtTheBeginning != fs.readdirSync(uploadDir).length) {
       
        isProcessing = true;
        return true;
    }

    const first15Elements: Array<{ priority_data: number, message_data: string, timestamp_data : Date }> = datas.splice(0, 15); 
    setTimeout(() => {
        sendToDatabase(first15Elements);
        sendDatasToDatabase(filesAtTheBeginning);
    }, 10000); // 10-second timeout

}

const sendToDatabase = (dataToSend: Array<{ priority_data: number, message_data: string, timestamp_data : Date }>) => {
    
   

    dataToSend.forEach((d) => {
        query(d.priority_data, d.message_data, d.timestamp_data);
    });
    
}

const query = (priority_data: number, message_data: string, currentDate_data: Date) => {
    client.query('INSERT INTO datas (priority_data, message_data, timestamp_data) VALUES ($1, $2, $3)', [priority_data, message_data, currentDate_data])
}


//routes

app.get('/', (req: Request, res: Response) => {
    res.sendFile('index.html', { root: __dirname });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});



app.post('/importDataFromFile', (req: Request, res: Response) => {
    


    upload(req, res, (err) => {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        saveDatas((req as any).file);
        return res.status(200).send("Datas received");
    });
});

app.get('/data', async (req: Request, res: Response) => {
    const from = req.query.data;
    const limit = req.query.number;
    

    // Costruisci la query in base ai parametri della query string
    let query = 'SELECT * FROM datas';

    if (from) {
        const fromDate = new Date(from as string);
        if (!isNaN(fromDate.getTime())) {
            query += ` WHERE timestamp_data >= '${fromDate.toISOString()}'`;
        } else {
            res.status(400).send('Invalid from date');
            return;
        }
    }

    if (limit) {
        const limitValue = parseInt(limit as string, 10);
        if (!isNaN(limitValue)) {
            query += ` LIMIT ${limitValue}`;
        } else {
            res.status(400).send('Invalid limit value');
            return;
        }
    }

    try {
        // Esegui la query e ottieni i dati
        client.query(query).then((result) => {
            const { rows } = result;
            res.json(rows);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/pendingdata', (req: Request, res: Response) => {
    res.json(datas);
});





