import express from 'express';
import fileUpload from 'express-fileupload';
import { Pool } from 'pg';
import { sleep } from './utils/sleep';


//App setup
const app: any = express();
app.use(fileUpload());
app.use(express.static('public'));
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'InternDeveloperPlus',
    password: 'root',
    port: 5432,
});
interface Data {
    priority: number;
    data: string;
}

//App state
let data: Data[] = [];
let processing: boolean = false;
const MAX_LINES_ALLOWED: number = 50;

//Functions
function parseTXT(file: any) {
    const lines: string[] = file.data.toString().split('\n');
    if (lines.length > MAX_LINES_ALLOWED)
        return false;
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
    processing = true;
    await pool.query(`CREATE TABLE IF NOT EXISTS data (
        id SERIAL PRIMARY KEY,
        data TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW()
        )`);

    let query = `INSERT INTO data(data) VALUES `;
    for (let i = 0; i < data.length && i < 15; i++)
        query += `('${data[i].data}'),`;
    query = query.slice(0, -1);
        
    pool.query(query);
    data.splice(0, 15);
    if (data.length > 0) {
        await sleep(10000);
        importData();
    }
    
    processing = false;
    return;
}
async function dbQuery(limit:number, from: number) {
    let query: string = 'SELECT * FROM data';
    if (from)
        query += ` WHERE timestamp>= TO_TIMESTAMP('${from}', 'yyyy-mm-ddThh24:mi:ss')`;
    query += ' ORDER BY timestamp DESC';
    if (limit)
        query += ` LIMIT ${limit}`;
    let result = await pool.query(query);
    return result.rows;
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
        return res.status(400).send('File is too long.');

    if (!processing)
        if (!importData())
            return res.status(400).send('File is formatted incorrectly.');
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
        
    return res.send(await dbQuery(req.query.limit, req.query.from));
});
app.listen(3000, () => {
    console.log('Server listening on port 3000');
    return;
});