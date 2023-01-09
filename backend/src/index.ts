import express, { Request, Response } from "express";
//@ts-ignore
import fileUploud from "express-fileupload";
//@ts-ignore
import cron from "node-cron";
import { insertData, getSavedData } from "./db";



const port = 4000;
const app = express()

app.use(express.json())
app.use(fileUploud())

let files: any = [];

let dataToProcess: DataWrapper[] = [];



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

class SavedData {
  constructor(K: number, D: string) {
    this.K = K;
    this.D = D;
  }
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
  if (dataToProcess.length > 0) {
    return res.send(dataToProcess).status(200);
  }
  else {

    return res.status(200);
  }
})

app.get("/data", async (req: Request, res: Response) => {


  let limit: number = Number(req.query.limit);
  let from: string = String(req.query.from); // UNIX timestamp format
  let data: SavedData[] = []


  try {
    let rows = await getSavedData(from, limit);


    for (let index = 0; index < rows.length; index++) {
      let saved: SavedData = rows[index]
      data.push(saved)

    }

    if (data.length > 0) {
      return res.send(data)
    }
    else {
      return res.status(200)
    }
  }
  catch (err) {
    console.log(err)
  }

})


app.post("/importDataFromFile", async (req, res: Response) => {


  //@ts-ignore
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  //@ts-ignore
  const file = req.files.data;

  files.push(file);

  let buf: Buffer = files[0].data

  let cleanedData = convertBufferToPKDArray(buf)

  dataToProcess = dataToProcess.concat(cleanedData)

  return res.sendStatus(200)
})

cron.schedule('*/10 * * * * *', async () => {
  console.log("10 sec")

  if (dataToProcess.length > 0) {



    let timestamp = new Date().getTime()

    let processed = sortByPriority(dataToProcess)

    let toSave = processed.slice(0, 15)

    if (dataToProcess.length > 0) {
      try {
        for (let index = 0; index < toSave.length; index++) {
          let response = await insertData(
            toSave[index].K,
            toSave[index].D,
            timestamp
          )
          console.log(response)
        }
      } catch (error) {
        console.log(error)
      }
      let remainingDataToSave = processed.slice(toSave.length)
      dataToProcess = remainingDataToSave

    }


  }
  else {
    console.log("giro skipapto")
  }

})


app.listen(port, () => {
  console.log("Server running on http://localhost:" + port)
})



