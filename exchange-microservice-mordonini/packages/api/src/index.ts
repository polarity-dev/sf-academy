import * as OpenApiValidator from 'express-openapi-validator'
import morgan from 'morgan'
import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'
import YAML from 'yaml'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'

const {
    PORT = 9003,
    NODE_ENV = 'dev'
} = process.env

const app = express()
const apiSpec = path.join(__dirname, '../openapi.yaml')
const apiYamlFile = YAML.parse(fs.readFileSync(apiSpec, 'utf-8'))

// Install bodyParsers for the request types API will support
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.text())

// Logger
app.use(morgan(NODE_ENV))

// Documentation
app.use('/api-docs/download', express.static(apiSpec))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiYamlFile))

// CORS middleware
app.use(cors())

// Install OpenApi Validator
app.use(
    OpenApiValidator.middleware({
      apiSpec,
      validateFormats: false,
      validateRequests: false,
      // Provide the base path to the operation handlers directory
      operationHandlers: path.join(__dirname), // default false
    }),
)

// Create a custom error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
    // format errors
    res.status(err.status || 500).json({
        status: err.status,
        message: err.message,
        errors: err.errors,
    })
    console.error(err.message)
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

export default app