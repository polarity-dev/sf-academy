import { Knex, knex } from "knex"
import { ServerUnaryCall, sendUnaryData, status, ServiceError } from "@grpc/grpc-js"
import { BuyRequest } from "../../../proto/usersPackage/BuyRequest"
import { BuyResponse } from "../../../proto/usersPackage/BuyResponse"
import knexConfig from "../../../knexConfig"
import exchangeClient from "../../../grpcClients/exchangeClient"
import { ExchangeResponse__Output } from "../../../proto/exchangePackage/ExchangeResponse"

const db: Knex = knex(knexConfig)

const Buy = (call: ServerUnaryCall<BuyRequest, BuyResponse>, callback: sendUnaryData<BuyResponse>): void => {
   
   const userId: string = call.request.userId as string
   const value: number = call.request.value as number
   const from: string = call.request.symbol as string

   exchangeClient.Exchange({
      from,
      to: (from === "USD") ? "EUR" : "USD",
      value
   }, (err, data) => {
      const exchangedValue: number = (data as ExchangeResponse__Output).value as number
      const eurDelta: number = (from === "USD") ? - exchangedValue : + value
      const usdDelta: number = (from === "USD") ? + value : - exchangedValue

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
            eurDelta,
            usdDelta,
            timestamp: new Date().toISOString()
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
      .then(data => callback(null, {}))
      .catch(err => {
         callback({
            code: status.ABORTED,
            message: "Insufficient credit"
         })
      })
   })
}

export default Buy