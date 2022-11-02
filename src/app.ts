import express, { Request, Response } from "express"
import path from "path"
import { urlencoded } from "body-parser"
import { selectFromPendingData, selectFromProcessedData } from "./utilities/db"
import fileUpload, { UploadedFile } from "express-fileupload"
import Debug from "debug"
import dotenv from "dotenv"
import { dataFilter, processData } from "./utilities/operations"
import { fakerGenerator } from "./utilities/fakerGenerator"

const debug = Debug("api")
Debug.enable("*")

dotenv.config()
const PORT = process.env.PORT
const app = express()

app.use(fileUpload(), urlencoded({ extended: false }))
void processData()

app.get("/", (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "../frontend/index.html"))
})

app.get("/fakerGenerator", (req: Request, res: Response) => {
  fakerGenerator()
  res.download(path.join(__dirname, "../faker.txt"), function(err) {
    if (err) {
      debug("%O", err)
    }
  })
})

app.post("/importDataFromFile", (req: Request, res: Response) => {
  res.status(200)
  const logFile = req.files!.faker as UploadedFile
  const buffer = logFile.data
  void dataFilter(buffer.toString("utf-8"))
})

app.get("/pendingData", async(req: Request, res: Response) => {
  try {
    const select = await selectFromPendingData()
    res.status(200).json(select)
  } catch (error) {
    debug("%O", error)
  }
})

app.get("/data", async(req: Request, res: Response) => {
  try {
    if (req.query.timestamp) {
      const select = await selectFromProcessedData({ timestamp: new Date(String(req.query.timestamp)), limit: Number(req.query.limit) })
      res.status(200).json(select)
    } else {
      const select = await selectFromProcessedData({ limit: Number(req.query.limit) })
      res.status(200).json(select)
    }
  } catch (error) {
    debug("%O", error)
  }
})

app.all("*", (req: Request, res: Response) => {
  res.status(404).send("<h1>Risorsa non trovata</h1>")
})

app.listen(PORT, () => {
  debug("%O", `⚡️[server]: Server is running at localhost: ${PORT}`)
})