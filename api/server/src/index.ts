import express from "express"
import { join } from "path"
import { middleware } from "express-openapi-validator"
import * as dotenv from "dotenv";
dotenv.config({ path: join(__dirname, '../../../../.env') });

const PORT = (process.env.NODE_ENV === "Production") ? process.env.API_PORT : 3000
const apiSpec = join(__dirname, "../../openapi/openapi.yaml")
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.text())
app.use(express.json())
app.use('/spec', express.static(apiSpec))

app.use(
  middleware({
    apiSpec,
    validateRequests: true,
    operationHandlers: join(__dirname)
  }),
)

app.listen(PORT, () => { console.log(`listening on port ${PORT}`) })