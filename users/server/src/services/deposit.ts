import { Knex, knex } from "knex"
import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js"
import { DepositRequest } from "../../../proto/usersPackage/DepositRequest"
import { DepositResponse } from "../../../proto/usersPackage/DepositResponse"
import knexConfig from "../../../knexConfig"

const db: Knex = knex(knexConfig)

const Deposit = (call: ServerUnaryCall<DepositRequest, DepositResponse>, callback: sendUnaryData<DepositResponse>): void => {
   const userId: string = call.request.userId as string
   const usdDelta: number = (call.request.symbol === "USD") ? call.request.value as number : 0
   const eurDelta: number = (call.request.symbol === "EUR") ? call.request.value as number : 0
   const timestamp: string = new Date().toISOString()
   db("transactions")
   .insert({
      userId,
      usdDelta,
      eurDelta,
      timestamp
   })
   .then(data => callback(null, {}))
   .catch(err => {
      callback({
         code: status.INTERNAL,
         message: "Failed insertion"
      })
   })
}

export default Deposit