import express from 'express';
import fileUpload from 'express-fileupload';
import { Pool } from 'pg';
import { sleep } from './utils/sleep';
import dotenv from 'dotenv';

//DB setup
dotenv.config()
const db = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'postgres',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT!),
});

//App setup
const app: any = express();
app.use(fileUpload());
app.use(express.static('public'));

//App state
interface Data {
    priority: number;
    data: string;
}
let data: Data[] = [];
let processing: boolean = false;

//Functions
function parseTXT(file: any) {
    const lines: string[] = file.data.toString().split('\n');
    for (let i = 0; i < lines.length; i++) {
        let priority: number = parseInt(lines[i].charAt(0));
        if (isNaN(priority))
            return false;
        if (priority > 5 || priority < 1)
            return false;
        data.push({ priority: priority, data: lines[i].substring(2) });
    }
    data.sort((a, b) => b.priority - a.priority);

    return true;
}
async function importData() {
    try {
        processing = true;

        let query = `INSERT INTO data(data) VALUES `;
        for (let i = 0; i < data.length && i < 15; i++) {
            query += `($${i+1}),`;
        }
        query = query.slice(0, -1);
        let values: string[] = [];
        for (let i = 0; i < data.length && i < 15; i++) {
            values.push(data[i].data);
        }
        await db.query(query, values);
        data.splice(0, 15);
        if (data.length > 0) {
            await sleep(10000);
            importData();
        }

        processing = false;
        return true;
    }
    catch (error) {
        console.log(error);
        processing = false;
        return false;
    }
}
async function dbQuery(limit: number, from: number) {
    try {
        let query: string = 'SELECT * FROM data';
        if (from)
            query += ` WHERE timestamp>= TO_TIMESTAMP('${from}', 'yyyy-mm-ddThh24:mi:ss')`;
        query += ' ORDER BY timestamp DESC';
        if (limit)
            query += ` LIMIT ${limit}`;
        let result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.log(error);
        return [];
    }
}

//Endpoints
app.get('/', (req: any, res: any) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/importDataFromFile', (req: any, res: any) => {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    const file: any = req.files.file;
    if (file.size === 0)
        return res.status(400).send('File is empty.');
    if (file.mimetype !== 'text/plain')
        return res.status(400).send('File is not a text file.');
    if (!parseTXT(file))
        return res.status(400).send('File is formatted incorrectly.');

    if (!processing)
        if (!importData())
            return res.status(400).send('DB is not available at the moment.');
    return res.send('File uploaded!');
});
app.get('/pendingData', (req: any, res: any) => {
    if (data.length === 0)
        return res.status(400).send('No data to process.');
    return res.send(data);
});
app.get('/data', async (req: any, res: any) => {
    if (req.query.limit) {
        if (isNaN(req.query.limit))
            return res.status(400).send('Limit is not a number.');
        if (req.query.limit > "9223372036854775807")
            return res.status(400).send('Limit is too high.');
        if (req.query.limit < 0)
            return res.status(400).send('Limit cannot be negative');
        if (req.query.limit === "0")
            return res.status(400).send('Really? 0? You want to see nothing?');
    }
    if (req.query.from && !(new Date(req.query.from) < new Date()))
        return res.status(400).send('Invalid date.');

    const dbResponce = await dbQuery(req.query.limit, req.query.from);
    if (dbResponce.length === 0)
        return res.status(400).send('DB offline');
    return res.send(dbResponce);
});
app.listen(process.env.WEBAPP_PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.WEBAPP_PORT || 3000}`);
    return;
});