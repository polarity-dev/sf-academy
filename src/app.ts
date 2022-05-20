import express from "express"
import bodyParser from "body-parser"
import { join } from "path"
import { initialize } from "express-openapi"
import swaggerUi from "swagger-ui-express"
import fileupload from "express-fileupload"
const op = require("./utilities/operations")
const docApi = require(join(__dirname, "../openAPI/api-doc.json"))

const app = express()
const apiPort = process.env.API_PORT || 3000

app.use(fileupload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(join(__dirname, "../public")))

app.get("/", function(req: express.Request, res: express.Response) {
  res.sendFile(join(__dirname, "../home.html"))
})

app.use(
  "/api-documentation",
  swaggerUi.serve,
  swaggerUi.setup(docApi, {
    swaggerOptions: {
      url: "http://localhost:3000/api-docs"
    }
  })
)

initialize({
  app,
  apiDoc: docApi,
  operations: { importFromFile: op.importFromFile, getPendingData: op.getPendingData, getData: op.getProcessedData }
})
op.processData()


app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))