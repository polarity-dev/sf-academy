import { join } from "path"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { ProtoGrpcType } from "../../proto/exchange"
import { Exchange } from "./services/exchange"

const PORT = 9000
const PROTO_FILE = "../../proto/exchange.proto"
const packageDef = protoLoader.loadSync(join(__dirname, PROTO_FILE))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType
const exchangePackage = grpcObj.exchangePackage

const server = new grpc.Server()

server.addService(exchangePackage.Exchange.service, {
   Exchange
})

server.bindAsync(
   `0.0.0.0:${PORT}`,
   grpc.ServerCredentials.createInsecure(),
   err => {
      if (err) throw err
      console.log(`Listening grpc exchange server on port ${PORT}`)
      server.start()
   }
)