import express, {Request, Response} from "express"

const app = express()

app.use(express.json())

app.get("/pendingData", (req: Request, res: Response) => {
  return res.send("Hello world!")
})

app.get("/data", (req: Request, res: Response) => {
  return res.send("Hello world!!!")
})


app.post("/importDataFromFile", (req: Request, res: Response) => {
  console.log(req.body)

  return res.sendStatus(200)
})


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})



