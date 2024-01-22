import express from 'express';
import fileUpload from 'express-fileupload';
import { Pool } from 'pg';
import path from 'path';
import dotenv from 'dotenv';

const app = express();
const indexPath = path.resolve(__dirname, './index.html');
dotenv.config();
const database = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'postgres',
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT!),
});

let data : string[] = [];
let active = false;

function sleep(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }

app.use(fileUpload());
app.use(express.json());
app.use(express.static(__dirname + '/views'));
app.set("view options", {layout: false});

app.get('/', (req, res) => {
    res.sendFile(indexPath);
});

app.post('/importDataFromFile', (req, res) => {
    if(!req.files)
        return res.status(400).send('No files were uploaded.');
    const file : any = req.files.file;
    if (file.mimetype !== 'text/plain')
        return res.status(400).send('File is not a txt file.');
    if (file.size === 0)
        return res.status(400).send('File empty.');
    if (!processData(file))
        return res.status(400).send('File too big.');
    if(!active)
        if(!importDataToDatabase())
            return res.status(500).send('Internal database error.');
    res.send('File uploaded!');
});

function processData(file: any) {
    const dataArray = file.data.toString('utf8').split('\n');
    if (dataArray.length > 50)
        return false;

    dataArray.sort()
    dataArray.reverse();
    data.concat(dataArray);

    for (let i = 0; i < dataArray.length; i++)
        data[i] = dataArray[i];
    return true;
}

async function importDataToDatabase () {
    try {
        active = true;

        let query = `INSERT INTO data(Stringa) VALUES `;
        for (let i = 0; i < data.length && i < 15; i++)
            query += `($${i+1}),`;
        query = query.slice(0, -1);
        
        let values: string[] = [];
        for (let i = 0; i < data.length && i < 15; i++)
            values.push(data[i].substring(2));
        await database.query(query, values);
        data.splice(0, 15);
        if (data.length > 0) {
            await sleep(10000);
            importDataToDatabase();
        }
        active = false;
        return true;
    } catch (error) {
        console.log(error);
        active = false;
        return false;
    }
}

app.get('/pendingData', (req, res) => { res.json(convertJson()) });

function convertJson() {
    let jsonArray: any[] = [];
    for (let i = 0; i < data.length; i++) {
        const jsonObject = {
            priority: data[i].substring(0, 1),
            string: data[i].substring(2)
        };
        jsonArray.push(jsonObject);
    }
    return jsonArray;
}

app.get('/data', async (req : any, res) => {
    if (req.query.from)
        if (!(new Date(req.query.from) < new Date()))
            res.status(400).send('Invalid date');
    if (req.query.limit)
        if (Number(req.query.limit) <= 0)
            res.status(400).send('Limit must be positive');
    const databaseResponce = await databaseQuery(req.query.limit, req.query.from);
    if (databaseResponce.length === 0)
        return res.status(500).send('Database offline');
    return res.send(databaseResponce);
});

async function databaseQuery(limit : number, from : string) {
    try {
        let query: string = 'SELECT * FROM data';
        if (from)
            query += ` WHERE timestamp>= TO_TIMESTAMP('${from}', 'yyyy-mm-ddThh24:mi:ss')`;
        query += ' ORDER BY timestamp DESC';
        if (limit)
            query += ` LIMIT ${limit}`;
        let result = await database.query(query);
        return result.rows;
    } catch (error) {
        console.log(error);
        return [];
    }
};

app.listen(process.env.WEBAPP_PORT_BACK || 3000, () => { console.log(`Server listening on port ${process.env.WEBAPP_PORT_BACK || 3000}`); });