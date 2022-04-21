import { Knex, knex } from "knex"
import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js"
import { WithdrawRequest } from "../../../proto/usersPackage/WithdrawRequest"
import { WithdrawResponse } from "../../../proto/usersPackage/WithdrawResponse"
import knexConfig from "../../../knexConfig"

const db: Knex = knex(knexConfig)

const Withdraw = (call: ServerUnaryCall<WithdrawRequest, WithdrawResponse>, callback: sendUnaryData<WithdrawResponse>): void => {
   const { userId, symbol, value } = call.request
   const usdDelta: number = (symbol === "USD") ? - (value as number) : 0
   const eurDelta: number = (symbol === "EUR") ? - (value as number) : 0
   const timestamp: string = new Date().toISOString()
   const type: string = "WITHDRAW"

   db("users")
   .select("usdBalance", "eurBalance")
   .where("userId", userId)
   .then(rows => rows[0])
   .then(data => {
      const { usdBalance, eurBalance } = data
      if (usdBalance + usdDelta < 0 || eurBalance + eurDelta < 0)
         throw new Error()
   })
   .then(() => {
      db("transactions")
      .insert({
         userId,
         usdDelta,
         eurDelta,
         timestamp,
         type: "WITHDRAW"
      })
      .then(() => {})
   })
   .then(() => {
      db("users")
      .update({
         "usdBalance": db.raw(`"usdBalance" + ${usdDelta}`),
         "eurBalance": db.raw(`"eurBalance" + ${eurDelta}`)
      })
      .where("userId", userId)
      .then(() => {})
   })
   .then(data => callback(null, {
      transaction: { eurDelta, usdDelta, timestamp, type }
   }))   
   .catch(err => {
      callback({
         code: status.ABORTED,
         message: "Insufficient credit"
      })
   })
}

export default Withdraw