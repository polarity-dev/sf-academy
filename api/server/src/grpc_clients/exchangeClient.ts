import { join } from "path"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { ProtoGrpcType } from "../../../proto/exchange"

const PORT = process.env.EXCHANGE_PORT || 9000
const HOST = process.env.EXCHANGE_HOST || "0.0.0.0"

console.log(PORT, HOST, process.env.NODE_ENV)

const PROTO_FILE = "../../../proto/exchange.proto"

const packageDef = protoLoader.loadSync(join(__dirname, PROTO_FILE))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType

const exchangeClient = new grpcObj.exchangePackage.Exchange(
   `${HOST}:${PORT}`,
   grpc.credentials.createInsecure()
)

export { exchangeClient }