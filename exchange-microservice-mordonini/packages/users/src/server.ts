// GRPC Interfaces
import { ProtoCat } from "protocat";
import { ServerCredentials } from '@grpc/grpc-js'
import { UsersServiceService } from "./proto/services/users/v1/services_grpc_pb";

import { errorHandler } from "./utils/errors";
import logger from './utils/logger'
import services from "./services";

import * as fs              from 'fs';
import * as path            from 'path'

// Environment
const { 
    PORT             = 9998,
    ROOT_CERT_FILE   = '../secrets/keys/sign/grpc_credentials/ca-cert.pem',
    SERVER_CERT_FILE = '../secrets/keys/sign/grpc_credentials/server-cert.pem',
    SERVER_KEY_FILE  = '../secrets/keys/sign/grpc_credentials/server-key.pem',
    NODE_ENV         = 'development'
} = process.env

// Authentication
const root_cert       = fs.readFileSync(path.join(ROOT_CERT_FILE))
const server_key      = fs.readFileSync(path.join(SERVER_KEY_FILE))
const server_cert     = fs.readFileSync(path.join(SERVER_CERT_FILE))
const credentials     = (NODE_ENV === 'production')
                            ? ServerCredentials.createSsl(root_cert, [{ cert_chain: server_cert, private_key: server_key }], true)
                            : ServerCredentials.createInsecure()

const app = new ProtoCat(credentials)

/**
 * Error handling
 */
app.use(errorHandler)

/**
 * Logging
 */
app.use(async (call, next) => {
    const start = performance.now()
    logger.debug(`${call.method}`, {
        request: call.request?.toObject(),
        clientMetadata: call.metadata.getMap(),
    })
    // Call to the underlying middlewares
    await next()
    const time = performance.now() - start
    logger.info(`${call.method} ${time.toFixed(3)} ms`, {
        response: call.response?.toObject(),
        durationMillis: time,
        initialMetadata: call.initialMetadata.getMap(),
        trailingMetadata: call.trailingMetadata.getMap(),
    })
})

/**
 * Services
 */
app.addService(UsersServiceService, services)

app.start(`0.0.0.0:${PORT}`).then(port => {
    console.log(`grpc started in port '${port}'`)
})