import { Knex, knex } from "knex"
import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js"
import { WithdrawRequest } from "../../../proto/usersPackage/WithdrawRequest"
import { WithdrawResponse } from "../../../proto/usersPackage/WithdrawResponse"
import knexConfig from "../../../knexConfig"

const db: Knex = knex(knexConfig)

const Withdraw = (call: ServerUnaryCall<WithdrawRequest, WithdrawResponse>, callback: sendUnaryData<WithdrawResponse>): void => {
   const userId: string = call.request.userId as string
   const usdDelta: number = (call.request.symbol === "USD") ? -(call.request.value as number) : 0
   const eurDelta: number = (call.request.symbol === "EUR") ? -(call.request.value as number) : 0
   const timestamp: string = new Date().toISOString()

   db("users")
   .select("usdBalance", "eurBalance")
   .where("userId", userId)
   .then(rows => rows[0])
   .then(data => {
      if (
         data.usdBalance + usdDelta < 0 ||
         data.eurBalance + eurDelta < 0
      ) throw new Error()
   })
   .then(data => {
      db("transactions")
      .insert({
         userId,
         usdDelta,
         eurDelta,
         timestamp
      })
      .then(data => callback(null, {}))
   })
   .catch(err => {
      callback({
         code: status.ABORTED,
         message: "Insufficient credit"
      })
   })

}

export default Withdraw