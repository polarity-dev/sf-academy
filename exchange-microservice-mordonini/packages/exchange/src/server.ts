import { ProtoCat } from "protocat";
import { ExchangeServiceService } from "./proto/services/exchange/v1/exchange_service_grpc_pb";

import { errorHandler } from "./utils/errors";
import logger from './utils/logger'
import services from "./services";

const { PORT=9999 } = process.env

const app = new ProtoCat()

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
app.addService(ExchangeServiceService, services)

app.start(`0.0.0.0:${PORT}`).then(port => {
    console.log(`grpc started in port '${port}'`)
})