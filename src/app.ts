import express, {Request, Response, NextFunction, Application, ErrorRequestHandler} from 'express';
import fileUpload from "express-fileupload";
import { join } from "path";
import { Buffer } from 'buffer';
const mysql = require('mysql');
const dotenv = require('dotenv');

const app: Application = express();
app.use(fileUpload());
app.use(express.json());
app.use(express.static(join(__dirname, "../public")));
const MAX_PER_10_SECONDS = 15;

/**
 * Dotenv
 * configuration for the envaironment variables 
 * stores sensible data not to shown
 */
 dotenv.config();

/**
 * Database information
 */
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

/**
 * Connect to database
 */
con.connect(function(err: any) {
    if (err) throw err;
    console.log("Connected to sfAcademy");
});

/**
 * @class Datas
 * @description Data rappresentation of the problem
 * @param {number} P
 * @param {number} K
 * @param {string} D
 */
class Datas {
    P: Number;
    K: Number;
    D: String;
    constructor(P: Number, K: Number, D: String) {
        this.P = P;
        this.K = K;
        this.D = D;
    }
}

/**
 * sort the arrayDatas by P descending
 * @param {Datas} a
 * @param {Datas} b
 * @returns {number}
 */
const sortByP = (a: Datas, b: Datas) => {
    return Number(b.P) - Number(a.P);
}

/**
 * Array of datas
 */
const arrayDatas: Datas[] = [];

/**
 * @function readFile
 * @param string 
 * @description Read the string (file) and parse the data and push it to arrayDatas
 */
const readFile = (string: String) => {
    var arr = string.split("\n");
    const A = Number(arr[0].split(" ")[0]);
    const B = Number(arr[0].split(" ")[1]);

    console.log(A, B);
    for (let i = A; i <= B; i++) {
        const line = arr[i];
        let P = Number(line.split(" ")[0]);
        let K = Number(line.split(" ")[1]);
        let D = String(line.split(" ")[2]);
        let datas = new Datas(P, K, D);
        arrayDatas.push(datas);
    }
}

function sleep(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @function processDatas
 * @description Process the data and insert them in the database
 */
const processDatas = async () => {
    arrayDatas.sort(sortByP);
    const timestamp = new Date().getTime();
    var arrElements = arrayDatas.length;
    const sleepTime = 10000/arrElements;
    for (let i = 0; i < arrayDatas.length && i < MAX_PER_10_SECONDS; i++) {
        const datas = arrayDatas[i];
        const K = datas.K;
        const D = datas.D;
        const query = `INSERT INTO processed_data (k, d, timestamp) VALUES (${K}, '${D}', ${timestamp})`;
        con.query(query, function (err: any, result: any) {
            if (err) throw err;
            console.log("record inserted");
        }
        );  
        // delete the element from the array
        arrayDatas.splice(i, 1);
        // 15 per 10 seconds
        await sleep(sleepTime);
    }
}

app.get("/", function(req: Request, res: Response, next: NextFunction) {
    res.sendFile(join(__dirname, "../index.html"));
});

app.post("/importDataFromFile", async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.files && req.files !== null) {
            if(req.files['myfile']){
                var buffer = req.files.myfile as fileUpload.UploadedFile;
                var data = buffer.data;
                const buff = Buffer.from(data);
                readFile(buff.toString());
                while(arrayDatas.length > 0) {
                    await processDatas();
                }
                console.log(arrayDatas);

                res.send(200);
            }
        }      
    } catch (error) {
        next(error);
    }
        
});

app.get("/pendingData", async (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(arrayDatas));  
});

app.get("/data", async (req: Request, res: Response, next: NextFunction) => {
    try {
        let query = `SELECT * FROM processed_data`;
        if (req.query.from) {
            query += ` WHERE timestamp >= ${req.query.from}`;
        }
        query += ` ORDER BY timestamp DESC`;
        if (req.query.limit) {
            query += ` LIMIT ${req.query.limit}`;
        }
        
        con.query(query, function (err: any, result: any) {
            if (err) throw err;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        });

    } catch (error) {
        next(error);
    }
});



app.listen(3000,()=> console.log('Server started on port 3000'));