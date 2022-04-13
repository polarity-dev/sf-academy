import { join } from "path"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { ProtoGrpcType } from "../../proto/exchange"
import Exchange from "./services/exchange"
import { exchangePort } from "../../config"

const packageDef = protoLoader.loadSync(join(__dirname, "../../proto/exchange.proto"))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType
const exchangePackage = grpcObj.exchangePackage

const server = new grpc.Server()

server.addService(exchangePackage.Exchange.service, {
   Exchange
})

server.bindAsync(
   `0.0.0.0:${exchangePort}`,
   grpc.ServerCredentials.createInsecure(),
   err => {
      if (err) throw err
      console.log(`Exchange listening server on port ${exchangePort}`)
      server.start()
   }
)