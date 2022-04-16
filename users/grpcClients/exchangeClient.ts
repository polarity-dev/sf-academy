import { join } from "path"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { ProtoGrpcType } from "../proto/exchange"
import { exchangeHost, exchangePort } from "../config"

const PROTO_FILE = "../proto/exchange.proto"

const packageDef = protoLoader.loadSync(join(__dirname, PROTO_FILE))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType

const exchangeClient = new grpcObj.exchangePackage.Exchange(
   `${exchangeHost}:${exchangePort}`,
   grpc.credentials.createInsecure()
)

export default exchangeClient