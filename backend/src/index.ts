import express, { Request, Response } from "express";
import fileUploud from "express-fileupload";
import path from "path";

const port = process.env.PORT || 3000;
const app = express()

let fileCounter = 0;

app.use(express.json())

app.use(fileUploud())


app.get("/pendingData", (req: Request, res: Response) => {
  return res.send("Hello world!")
})

app.get("/data", (req: Request, res: Response) => {
  return res.send("ciao")
})


app.post("/importDataFromFile", (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.data;

  const path = __dirname + "/files/" + `${fileCounter}_` + file.name;

  file.mv(path, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

  })

  fileCounter += 1
  return res.sendStatus(200)


})


app.listen(port, () => {
  console.log("Server running on http://localhost: " + port)
})



