import express, { NextFunction, Request, Response } from "express";
//import * as expFl from "express-fileupload";
import dotenv from "dotenv";
import { Pool } from "pg";
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as querystring from 'querystring';


//Connessione al Database
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(/*process.env.DB_PORT || */"5432"),
  idleTimeoutMillis: 40000
});

const connectToDB = async () => {
  try {
    await pool.connect();
  } catch (err) {
    //console.log(err);
  }
};

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

function creationTable(){
  let query= 'CREATE TABLE IF NOT EXISTS valuedata ( guid SERIAL,';
  query +=  ' valuep integer NOT NULL,';
  query +=  ' valuek integer NOT NULL,';
  query +=  ' valued text COLLATE pg_catalog."default" NOT NULL,';
  query +=  ' "timestamp" timestamp without time zone NOT NULL,';
  query +=  ' CONSTRAINT valuedata_pkey PRIMARY KEY (guid)';
  query +=  ' ) ';
  query +=  ' TABLESPACE pg_default;';
  query +=  ' ALTER TABLE IF EXISTS public.valuedata';
  query +=  ' OWNER to postgres;'
  pool.query(
    query,
    (err, res) => {
      //console.log(err, res);
    }
  );
  
}

creationTable();


async function sortArray(valueArray: {"P" :number, "K":number, "D":string} []){
  valueArray.sort((a, b) => (a.P > b.P) ? -1 : 1);
  return valueArray;

}



//Variabili per la parametrizzazione del file che va a leggere (prova locale)
let dirBefore :string = "";
let howManyDirBefore : number = 0;
let nameFile : string = "filePriority";
let extensionFile : string = ".txt";

//Variabili per il salvataggio dei dati dal file
let fileStream: fs.ReadStream;
let rl:readline.Interface;
let A: number =0;
let B: number =0;
let P: number[] = [];
let K: number[] = []; 
let D: string[] = []; 
let j :number = 1;
let allData: {
 "P" :number, 
 "K":number, 
 "D":string
}[] = [];
let sortedData: any;
let to_timestampvar: any;

//Variabili per le richieste

const app = express();
const fileUpload = require('express-fileupload'); 
const corsi = require('cors');

app.use(corsi(
  {
    origin: '*'
  }
));

app.use(fileUpload());




let iAmProcessing: boolean = false;

//variabili per il database
dotenv.config();

//Concatenazione dei parametri del file che va a leggere (prova locale)
for (let i :number = 0; i<howManyDirBefore; i++){
    dirBefore = dirBefore + "../"
}
nameFile=dirBefore+nameFile+extensionFile;

let state:string;
let Timer=10;
let timerRestart:boolean=false;


async function timesGoesDown(Timer:number, limit:number, maxLimit:number){
  Timer=Timer-1;
  if(Timer<0) limit = maxLimit;

}
let maxLimit:number=2;
let limit: number = maxLimit;

async function waitUntil() {
  return await new Promise(resolve => {
    const interval = setInterval(() => {
      if (Timer<=0) {
        resolve('foo');
        limit=maxLimit
        clearInterval(interval);
      };
      Timer=Timer-1;
      //console.log(Timer);
    }, 1000);
  });
}

async function waitUntilProcessing() {
  return await new Promise(resolve => {
    const interval2 = setInterval(() => {
      if (!iAmProcessing) {
        resolve('foo');
        clearInterval(interval2);
      };
      //console.log("processWait");
    }, 1000);
  });
}


//Salvataggio dei dati (prova locale)

let timerReduce;

async function processLineByLine(fileToProcess:any ) {
//console.log("IAmIn");
state="no";
iAmProcessing=true;
fileStream = fs.createReadStream (fileToProcess);
rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let i : number = 0;
  let t : number = 0;
 //TODO limit max?
  Timer=10;
  timerReduce = waitUntil();
  
  for await (const line of rl) { //prendo le linee del file
    state="ok";
    //console.log("the real test");
    if(i==0){ // se è la prima linea allora devo salvarmi A e B
        A=+line.substring(0,line.indexOf(" "));
        B=+line.substring(line.indexOf(" "));
        //console.log("Sono un minimo valido?");
        //console.log(A + " " + B);
    }
    else{ //altrimenti devo salvarmi i dati p k d
        if(i>=A && i<=B){ //solo quelli validi
          if(limit>0){ //controllo che possa ancora prendere dei dati
              //console.log(i);
              P[t]=+line.substring(0,line.indexOf(" "));  // P è sempre all'inizio
              j=1;
              do { // controllo per K che non ci siano degli spazi in più, un errore generico dato che non mi era chiaro se i dati dovessero essere controllati o meno (ho fatto solo un errore generico per ora)
                  let internalLine : string = line.substring(line.indexOf(" ")+j)
                  if(internalLine[0]!=' ') {
                      K[t]=+internalLine.substring(0, internalLine.indexOf(" "))//line.substring(line.indexOf(" ")+1,)); // mi salvo fino allo spazio che trova dopo
                  }
                  j++;
              }
              while (isNaN(K[t]) && j < 20) //se ci sono più di 20 spazi allora non va bene
              D[t]=line.substring(j+K[t].toString().length+P[t].toString().length);
              if(limit==maxLimit){ //è il primo caso di input del messaggio
                  Timer = 10;
              }
              //console.log("pushing");
              allData.push({"P" : P[t],"K" : K[t],"D":D[t]}); //salvo i dati
          }
          else{
            await timerReduce.then(async()=>{
                  if(limit>0){
                    //console.log("sono fuori dal ciclo..");
                    //fermo la funzione del timer e inserisco il dato che avevo prima
                    to_timestampvar= (Date.now()/1000.0);
                    sortedData = await sortArray(allData) //prendo tutti i dati dato che ormai sono al limite (se no non saprei quando ordinarli)
                    for(let pSortedData:number = 0; pSortedData <sortedData.length; pSortedData++)
                    {
                      //console.log("Ho inserito nel database");
                      await insertIntoDatabase(sortedData[pSortedData])
                    }
                    allData = []; //svuoto alldata così che possa ricominciare a riempirsi
                    P[t]=+line.substring(0,line.indexOf(" "));
                    j=1;
                    do { // controllo per K che non ci siano degli spazi in più, un errore generico dato che non mi era chiaro se i dati dovessero essere controllati o meno (ho fatto solo un errore generico per ora)
                        let internalLine : string = line.substring(line.indexOf(" ")+j)
                        if(internalLine[0]!=' ') {
                            K[t]=+internalLine.substring(0, internalLine.indexOf(" "))//line.substring(line.indexOf(" ")+1,)); // mi salvo fino allo spazio che trova dopo
                        }
                        j++;
                    }
                    while (isNaN(K[t]) && j < 20) //se ci sono più di 20 spazi allora non va bene

                    allData.push({"P" : P[t],"K" : K[t],"D":D[t]}); //salvo i dati
                    //console.log("ho appena caricato degli altri dati");
                    D[t]=line.substring(j+K[t].toString().length+P[t].toString().length);
                    if(limit==maxLimit){ 
                      Timer = 10;
                      timerRestart=false;
                      timerReduce = waitUntil();
                    }
 
                  }
              })
          }

            //console.log(D[i-1]);
            t++; 
            limit--;
        }
    }

    i++;
    
  }
  limit = maxLimit;
  timerRestart=true;//hmm..
  Timer=-1;
  await timerReduce;

  to_timestampvar= (Date.now()/1000.0);
  sortedData = await sortArray(allData) //prendo tutti i dati dato che ormai sono al limite (se no non saprei quando ordinarli)
  for(let pSortedData:number = 0; pSortedData <sortedData.length; pSortedData++)
  {
    //console.log("Ho inserito nel database");
    await insertIntoDatabase(sortedData[pSortedData])
  }

  allData = [];
  iAmProcessing=false;
  return;
  //console.log(JSON.stringify(sortedData));




}

//

/*async function setTimerBelowZero(){
    Timer=-1;
}*/
async function insertIntoDatabase(valueDataFile : {"P" :number, "K":number, "D":string}){ //async?
    //console.log(pool);
    pool.query(
        "INSERT INTO " + "valuedata" +` (valuep, valuek, valued, timestamp) VALUES (` +valueDataFile.P+`,`+ valueDataFile.K +`,'${valueDataFile.D}',` + `to_timestamp(${to_timestampvar})) returning *`,
        (err, res) => {
          console.log(err, res);
        }
      );
      return;
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
})

app.get('/data', (req, response) => {
    let from = req.query.from;
    let limitReq = req.query.limit;
    let query : string = "SELECT * FROM valuedata"; //ORDER BY TIMESTAMP";
    if(!(from === undefined)){
      let fromDate=Date.parse(String(from))/1000;
      let toDate = Date.now() / 1000.0;
      query+=" WHERE timestamp BETWEEN "+ `to_timestamp(${fromDate})` + ` AND to_timestamp(${toDate})`;
    }
    query+=" ORDER BY TIMESTAMP"
    if(Number(limitReq)>0){
      //console.log(limitReq);
      query+=" LIMIT "+Number(limitReq);
    }


    pool.query(
        query,
        (err, res) => {
            if(res)response.json(res.rows);
            else response.json(err)
        }
    );
    return;
  })


  let timerReduceProcessing;
  var fileAccorporated :  {}[] = [];
  //let numberRequest
  app.post('/importDataFromFile', async function(req, res) //ok
  {
      var file:any = "";
      if(!req.files)
      {
          res.send("File was not found");
          return;
      }
  
     file = req.files.fileSF;  // here is the field name of the form
     console.log(file);
     fileAccorporated.push(file);
     timerReduceProcessing = waitUntilProcessing()
     timerReduceProcessing.then(async()=>{
      //await setTimerBelowZero();
      fs.writeFileSync(nameFile,toSaveData(fileAccorporated.shift()));
      await processLineByLine(nameFile);
      res.send("File Uploaded");
     })

      /*processLineByLine(nameFile).then(()=>{
        if(state==="ok") return res.send("File Uploaded");
        else return res.send("Error!");
      }
      )*/
    /*}
    else{
      
    }*/

  });

  function toSaveData(file:any ){
     return file.data;
  }
  app.listen(8081);







