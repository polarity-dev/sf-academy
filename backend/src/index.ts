import express, { Request, Response } from "express";
//@ts-ignore
import fileUploud from "express-fileupload";
//@ts-ignore
import cron from "node-cron";

import pool from "./mariadb"


const port = process.env.PORT || 4000;
const app = express()

let files: any = [];

let dataToProcess: DataWrapper[] = [];

app.use(express.json())

app.use(fileUploud())

class DataWrapper {
  constructor(P: number, K: number, D: string) {

    this.P = P;
    this.K = K;
    this.D = D;
  }

  P: number;
  K: number;
  D: string;
}

const convertBufferToPKDArray = (buffer: Buffer) => {
  let text: string = buffer.toString('utf-8')

  let arrayOfLines: string[] = text.split("\n")

  let firstLine: string[] = arrayOfLines[0].split(" ")

  let A: number = Number(firstLine[0])
  let B: number = Number(firstLine[1])

  let processedData: DataWrapper[] = []


  for (let index = 0; index < arrayOfLines.length; index++) {
    if (index === A || index === B || index > A && index < B) {
      processedData.push(preprocessString(arrayOfLines[index]))
    }
  }

  return processedData;

}

const preprocessString = (rawData: string): DataWrapper => {

  let P = Number(rawData.substring(0, rawData.indexOf(' '))); // first number 
  let secondHalfOfString: string = rawData.substring(rawData.indexOf(' ') + 1); // second number and the frase

  let K = Number(secondHalfOfString.substring(0, secondHalfOfString.indexOf(' '))); // second number 
  let D = secondHalfOfString.substring(secondHalfOfString.indexOf(' ') + 1); // string 


  return new DataWrapper(P, K, D)
}


const sortByPriority = (data: DataWrapper[]): DataWrapper[] => {
  const order = [5, 4, 3, 2, 1]

  let sortedData = data.sort((x, y) => order.indexOf(x.P) - order.indexOf(y.P))

  return sortedData;
}


app.get("/pendingData", (req: Request, res: Response) => {
  return res.send(dataToProcess).sendStatus(200);
})

app.get("/data", (req: Request, res: Response) => {
  
  console.log(req)

  return res.sendStatus(200);

})


app.post("/importDataFromFile", (req, res) => {

  //@ts-ignore
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  //@ts-ignore
  const file = req.files.data;

  //TODO: 
  //  - aggiungere un check sul tipo di file(da accettare solo file *.txt)

  files.push(file);

  let buf: Buffer = files[0].data

  let cleanedData = convertBufferToPKDArray(buf)

  //let sortedData = sortByPriority(processedData) 
  //TODO: put the sorting in the scheduled part

  dataToProcess = dataToProcess.concat(cleanedData)

  return res.sendStatus(200)
})

cron.schedule('*/10 * * * * *', () => {
  console.log("10 sec passati")

  // penso che metterò il sorting per priorità qui cosi non viene chimato ogni singola vlta che arrivano dati ma solo quando deve inviare i dati al db
  // TODO:
  //  - istanziare un db (prob mariadb)
  //  - inviare massimo 15 messaggi
  //  - inserire un time stamp unico per tutti i dati inviati in una certa batch(penso di inviare la data di inizio del processo di salvataggio per averla uguale su tutti)
  //

  // userò questaa parte per gli scheduling jobs che devono essere eseguiti

  // pool.getConnection()
  //   .then(conn => {
  //
  //     return conn.query("SHOW DATABASES;")
  //
  //   })
  //   .then(res => {
  //     console.log(res)
  //   })
  //
  // pool.getConnection()
  //   .then(conn => {
  //     return conn.query("CREATE TABLE if not exists sf_saved_data (K INT, D INT, TS TIMESTAMP);")
  //   })
  //   .then(res => {
  //     console.log(res)
  //   })
  //
  // pool.getConnection()
  //   .then(conn => {
  //
  //     return conn.query("SELECT * FROM database.sf_saved_data;")
  //
  //   })
  //   .then(res => {
  //     console.log(res)

  // console.log(new Date().toLocaleString("it", {timeZone: "Europe/Rome"}))

  let timestamp = new Date()

  let processed = sortByPriority(dataToProcess)

  let toSave = processed.slice(0, 15)


  pool.getConnection()
    .then(conn => {
      let response = conn.query("CREATE TABLE if not exists sf_saved_data (K INT, D CHAR(255), TS TIMESTAMP);")
      conn.end();
      return response;
    })
    .then(res => {
      console.log(res)
    })

  for (let index = 0; index < toSave.length; index++) {

    pool.getConnection()
      .then(async conn => {
        const res = await conn.query("INSERT INTO sf_saved_data VALUES (?, ?, ?);",
          [
            toSave[index].K,
            toSave[index].D,
            timestamp,
          ]
        );
        console.log(res);
        conn.end();
      })
  }



  console.log(toSave.length)

  console.log(dataToProcess.length)

  let remainingDataToSave = processed.slice(toSave.length)

  console.log(remainingDataToSave)


  dataToProcess = remainingDataToSave

})


app.listen(port, () => {
  console.log("Server running on http://localhost:" + port)
})



