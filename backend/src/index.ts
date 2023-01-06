import express, { Request, Response } from "express";
import fileUploud from "express-fileupload";
import path from "path";


const port = process.env.PORT || 3000;
const app = express()

let fileCounter = 0;

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
  return res.send("Hello world!")
})

app.get("/data", (req: Request, res: Response) => {
  return res.send("ciao")
})


app.post("/importDataFromFile", (req, res) => {
  //@ts-ignore
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  //@ts-ignore
  const file = req.files.data;

  files.push(file);

  let buf: Buffer = files[0].data

  let text: string = buf.toString('utf-8')

  let arrayOfLines: string[] = text.split("\n")

  let firstLine: string[] = arrayOfLines[0].split(" ")

  let A: number = Number(firstLine[0])
  let B: number = Number(firstLine[1])

  console.log(A)
  console.log(B)


  for (let index = 0; index < arrayOfLines.length; index++) {
    if (index === A || index === B || index > A && index < B) {
      dataToProcess.push(preprocessString(arrayOfLines[index]))
    }
  }

  arrayOfLines = []

  console.log(dataToProcess)

  let sortedData = sortByPriority(dataToProcess)

  console.log(sortedData)

  return res.sendStatus(200)
})


app.listen(port, () => {
  console.log("Server running on http://localhost:" + port)
})



