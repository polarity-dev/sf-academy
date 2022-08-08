"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import * as expFl from "express-fileupload";
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
//Connessione al Database
dotenv_1.default.config();
const pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(/*process.env.DB_PORT || */ "5432"),
    idleTimeoutMillis: 40000
});
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.connect();
    }
    catch (err) {
        //console.log(err);
    }
});
connectToDB();
/*function destroyTable(){
  let query= 'DROP TABLE IF EXISTS valuedata';
  pool.query(
    query,
    (err, res) => {
      console.log(err, res);
    }
  );
  
}

destroyTable();*/
function creationTable() {
    let query = 'CREATE TABLE IF NOT EXISTS valuedata ( guid SERIAL,';
    query += ' valuep integer NOT NULL,';
    query += ' valuek integer NOT NULL,';
    query += ' valued text COLLATE pg_catalog."default" NOT NULL,';
    query += ' "timestamp" timestamp without time zone NOT NULL,';
    query += ' CONSTRAINT valuedata_pkey PRIMARY KEY (guid)';
    query += ' ) ';
    query += ' TABLESPACE pg_default;';
    query += ' ALTER TABLE IF EXISTS public.valuedata';
    query += ' OWNER to postgres;';
    pool.query(query, (err, res) => {
        //console.log(err, res);
    });
}
creationTable();
function sortArray(valueArray) {
    return __awaiter(this, void 0, void 0, function* () {
        valueArray.sort((a, b) => (a.P > b.P) ? -1 : 1);
        return valueArray;
    });
}
//Variabili per la parametrizzazione del file che va a leggere (prova locale)
let dirBefore = "";
let howManyDirBefore = 0;
let nameFile = "filePriority";
let extensionFile = ".txt";
//Variabili per il salvataggio dei dati dal file
let fileStream;
let rl;
let A = 0;
let B = 0;
let P = [];
let K = [];
let D = [];
let j = 1;
let allData = [];
let sortedData;
let to_timestampvar;
//Variabili per le richieste
const app = (0, express_1.default)();
const fileUpload = require('express-fileupload');
const corsi = require('cors');
app.use(corsi({
    origin: '*'
}));
app.use(fileUpload());
let iAmProcessing = false;
//variabili per il database
dotenv_1.default.config();
//Concatenazione dei parametri del file che va a leggere (prova locale)
for (let i = 0; i < howManyDirBefore; i++) {
    dirBefore = dirBefore + "../";
}
nameFile = dirBefore + nameFile + extensionFile;
let state;
let Timer = 10;
let timerRestart = false;
function timesGoesDown(Timer, limit, maxLimit) {
    return __awaiter(this, void 0, void 0, function* () {
        Timer = Timer - 1;
        if (Timer < 0)
            limit = maxLimit;
    });
}
let maxLimit = 2;
let limit = maxLimit;
function waitUntil() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise(resolve => {
            const interval = setInterval(() => {
                if (Timer <= 0) {
                    resolve('foo');
                    limit = maxLimit;
                    clearInterval(interval);
                }
                ;
                Timer = Timer - 1;
                //console.log(Timer);
            }, 1000);
        });
    });
}
function waitUntilProcessing() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise(resolve => {
            const interval2 = setInterval(() => {
                if (!iAmProcessing) {
                    resolve('foo');
                    clearInterval(interval2);
                }
                ;
                //console.log("processWait");
            }, 1000);
        });
    });
}
//Salvataggio dei dati (prova locale)
let timerReduce;
function processLineByLine(fileToProcess) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        //console.log("IAmIn");
        state = "no";
        iAmProcessing = true;
        fileStream = fs.createReadStream(fileToProcess);
        rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        let i = 0;
        let t = 0;
        //TODO limit max?
        Timer = 10;
        timerReduce = waitUntil();
        try {
            for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), !rl_1_1.done;) {
                const line = rl_1_1.value;
                state = "ok";
                //console.log("the real test");
                if (i == 0) { // se è la prima linea allora devo salvarmi A e B
                    A = +line.substring(0, line.indexOf(" "));
                    B = +line.substring(line.indexOf(" "));
                    //console.log("Sono un minimo valido?");
                    //console.log(A + " " + B);
                }
                else { //altrimenti devo salvarmi i dati p k d
                    if (i >= A && i <= B) { //solo quelli validi
                        if (limit > 0) { //controllo che possa ancora prendere dei dati
                            //console.log(i);
                            P[t] = +line.substring(0, line.indexOf(" ")); // P è sempre all'inizio
                            j = 1;
                            do { // controllo per K che non ci siano degli spazi in più, un errore generico dato che non mi era chiaro se i dati dovessero essere controllati o meno (ho fatto solo un errore generico per ora)
                                let internalLine = line.substring(line.indexOf(" ") + j);
                                if (internalLine[0] != ' ') {
                                    K[t] = +internalLine.substring(0, internalLine.indexOf(" ")); //line.substring(line.indexOf(" ")+1,)); // mi salvo fino allo spazio che trova dopo
                                }
                                j++;
                            } while (isNaN(K[t]) && j < 20); //se ci sono più di 20 spazi allora non va bene
                            D[t] = line.substring(j + K[t].toString().length + P[t].toString().length);
                            if (limit == maxLimit) { //è il primo caso di input del messaggio
                                Timer = 10;
                            }
                            //console.log("pushing");
                            allData.push({ "P": P[t], "K": K[t], "D": D[t] }); //salvo i dati
                        }
                        else {
                            yield timerReduce.then(() => __awaiter(this, void 0, void 0, function* () {
                                if (limit > 0) {
                                    //console.log("sono fuori dal ciclo..");
                                    //fermo la funzione del timer e inserisco il dato che avevo prima
                                    to_timestampvar = (Date.now() / 1000.0);
                                    sortedData = yield sortArray(allData); //prendo tutti i dati dato che ormai sono al limite (se no non saprei quando ordinarli)
                                    for (let pSortedData = 0; pSortedData < sortedData.length; pSortedData++) {
                                        //console.log("Ho inserito nel database");
                                        yield insertIntoDatabase(sortedData[pSortedData]);
                                    }
                                    allData = []; //svuoto alldata così che possa ricominciare a riempirsi
                                    P[t] = +line.substring(0, line.indexOf(" "));
                                    j = 1;
                                    do { // controllo per K che non ci siano degli spazi in più, un errore generico dato che non mi era chiaro se i dati dovessero essere controllati o meno (ho fatto solo un errore generico per ora)
                                        let internalLine = line.substring(line.indexOf(" ") + j);
                                        if (internalLine[0] != ' ') {
                                            K[t] = +internalLine.substring(0, internalLine.indexOf(" ")); //line.substring(line.indexOf(" ")+1,)); // mi salvo fino allo spazio che trova dopo
                                        }
                                        j++;
                                    } while (isNaN(K[t]) && j < 20); //se ci sono più di 20 spazi allora non va bene
                                    allData.push({ "P": P[t], "K": K[t], "D": D[t] }); //salvo i dati
                                    //console.log("ho appena caricato degli altri dati");
                                    D[t] = line.substring(j + K[t].toString().length + P[t].toString().length);
                                    if (limit == maxLimit) {
                                        Timer = 10;
                                        timerRestart = false;
                                        timerReduce = waitUntil();
                                    }
                                }
                            }));
                        }
                        //console.log(D[i-1]);
                        t++;
                        limit--;
                    }
                }
                i++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rl_1_1 && !rl_1_1.done && (_a = rl_1.return)) yield _a.call(rl_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        limit = maxLimit;
        timerRestart = true; //hmm..
        Timer = -1;
        yield timerReduce;
        to_timestampvar = (Date.now() / 1000.0);
        sortedData = yield sortArray(allData); //prendo tutti i dati dato che ormai sono al limite (se no non saprei quando ordinarli)
        for (let pSortedData = 0; pSortedData < sortedData.length; pSortedData++) {
            //console.log("Ho inserito nel database");
            yield insertIntoDatabase(sortedData[pSortedData]);
        }
        allData = [];
        iAmProcessing = false;
        return;
    });
}
//
/*async function setTimerBelowZero(){
    Timer=-1;
}*/
function insertIntoDatabase(valueDataFile) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log(pool);
        pool.query("INSERT INTO " + "valuedata" + ` (valuep, valuek, valued, timestamp) VALUES (` + valueDataFile.P + `,` + valueDataFile.K + `,'${valueDataFile.D}',` + `to_timestamp(${to_timestampvar})) returning *`, (err, res) => {
            console.log(err, res);
        });
        return;
    });
}
/*async function selectFromDatabase(){
    //console.log(pool);
    let realRes;

      return realRes;
}*/
//selectFromDatabase();
app.get('/pendingData', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(allData);
    res.send(JSON.stringify(allData));
    //res.status(200).json();
});
app.get('/data', (req, response) => {
    let from = req.query.from;
    let limitReq = req.query.limit;
    let query = "SELECT * FROM valuedata"; //ORDER BY TIMESTAMP";
    if (!(from === undefined)) {
        let fromDate = Date.parse(String(from)) / 1000;
        let toDate = Date.now() / 1000.0;
        query += " WHERE timestamp BETWEEN " + `to_timestamp(${fromDate})` + ` AND to_timestamp(${toDate})`;
    }
    query += " ORDER BY TIMESTAMP";
    if (Number(limitReq) > 0) {
        //console.log(limitReq);
        query += " LIMIT " + Number(limitReq);
    }
    pool.query(query, (err, res) => {
        if (res)
            response.json(res.rows);
        else
            response.json(err);
    });
    return;
});
let timerReduceProcessing;
var fileAccorporated = [];
//let numberRequest
app.post('/importDataFromFile', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var file = "";
        if (!req.files) {
            res.send("File was not found");
            return;
        }
        file = req.files.fileSF; // here is the field name of the form
        console.log(file);
        fileAccorporated.push(file);
        timerReduceProcessing = waitUntilProcessing();
        timerReduceProcessing.then(() => __awaiter(this, void 0, void 0, function* () {
            //await setTimerBelowZero();
            fs.writeFileSync(nameFile, toSaveData(fileAccorporated.shift()));
            yield processLineByLine(nameFile);
            res.send("File Uploaded");
        }));
        /*processLineByLine(nameFile).then(()=>{
          if(state==="ok") return res.send("File Uploaded");
          else return res.send("Error!");
        }
        )*/
        /*}
        else{
          
        }*/
    });
});
function toSaveData(file) {
    return file.data;
}
app.listen(8081);
