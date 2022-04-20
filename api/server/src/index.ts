import express, { Response, Request, NextFunction } from "express"
import { join } from "path"
import { middleware } from "express-openapi-validator"
import { OpenAPIV3 } from "openapi-types";
import verifyToken from "../../middlewares/verifyToken"
import { apiPort, host } from "../../config"
import apiErrorHandler from "../../errorHandlers/apiErrorHandler";
import grpcErrorHandler from "../../errorHandlers/grpcErrorHandler";
import cors from "cors"

const apiSpec = join(__dirname, "../../openapi/openapi.yaml")
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.text())
app.use(express.json())
app.use((req, resp, next) => { next() }, cors({ maxAge: 84600 }))

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, DELETE, PATCH, PUT")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept, Authorization")
  next()
})
app.use("/spec", express.static(apiSpec))
app.use(
  middleware({
    apiSpec,
    validateRequests: true,
    validateResponses: true,
    operationHandlers: join(__dirname),
    validateSecurity: {
      handlers: {
        bearerAuth: (req: express.Request, scopes: string[], schema: OpenAPIV3.SecuritySchemeObject) : boolean => 
        verifyToken(req)
      }
    }
  })
)
app.use(apiErrorHandler)
app.use(grpcErrorHandler)

app.listen(apiPort, () => { console.log(`Api server listening on port ${apiPort}`) })
