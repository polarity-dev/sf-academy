import { join } from "path"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { ProtoGrpcType } from "../../../proto/exchange"

const PORT = (process.env.NODE_ENV === "Production" ? process.env.EXCHANGE_PORT : 9000)
const PROTO_FILE = "../../../proto/exchange.proto"

const packageDef = protoLoader.loadSync(join(__dirname, PROTO_FILE))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType
const exchangeClient = new grpcObj.exchangePackage.Exchange(
   `0.0.0.0:${PORT}`,
   grpc.credentials.createInsecure()
)

export { exchangeClient }