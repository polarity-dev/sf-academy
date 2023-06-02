// gRPC exchange client interface
import { ExchangeServiceClient } from "../proto/services/exchange/v1/exchange_service_grpc_pb"
// gRPC login channel factory
import { ChannelCredentials }   from "@grpc/grpc-js";

const {
    EXCHANGE_SERVER_HOST    = 'exchange',
    EXCHANGE_SERVER_PORT    = 9000
} = process.env

const credentials = ChannelCredentials.createInsecure()
const client = new ExchangeServiceClient(`${EXCHANGE_SERVER_HOST}:${EXCHANGE_SERVER_PORT}`, credentials)

export default client