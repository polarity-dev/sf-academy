import { join } from "path"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { ProtoGrpcType } from "../../proto/users"
import Login from "./services/login"
import Signup from "./services/signup"
import Deposit from "./services/deposit"
import Withdraw from "./services/withdraw"
import ListTransactions from "./services/listTransactions"
import Buy from "./services/buy"
import GetUser from "./services/getUser"
import { usersPort } from "../../config"

const packageDef = protoLoader.loadSync(join(__dirname, "../../proto/users.proto"))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType
const usersPackage = grpcObj.usersPackage

const server = new grpc.Server()

server.addService(usersPackage.Users.service, {
   Login,
   Signup,
   ListTransactions,
   Deposit,
   Withdraw,
   Buy,
   GetUser
})

server.bindAsync(
   `0.0.0.0:${usersPort}`,
   grpc.ServerCredentials.createInsecure(),
   err => {
      if (err) throw err
      console.log(`Users server listening on port ${usersPort}`)
      server.start()
   }
)