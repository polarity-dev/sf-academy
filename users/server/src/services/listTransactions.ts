import { Knex, knex } from "knex"
import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js"
import { ListTransactionsRequest } from "../../../proto/usersPackage/ListTransactionsRequest"
import { ListTransactionsResponse } from "../../../proto/usersPackage/ListTransactionsResponse"
import knexConfig from "../../../knexConfig"

const db: Knex = knex(knexConfig)

const ListTransactions = (call: ServerUnaryCall<ListTransactionsRequest, ListTransactionsResponse>, callback: sendUnaryData<ListTransactionsResponse>): void => {
   const userId: string = call.request.userId as string
   db.select("usdDelta", "eurDelta", "timestamp")
   .from("transactions")
   .where("userId", userId)
   .then(data => 
      data.map(transaction => {
         transaction.timestamp = new Date(transaction.timestamp).toISOString()
         return transaction
      })
   )
   .then(data => callback(null, { transactions: data }))
   .catch(err => {
      callback({
         code: status.INTERNAL,
         message: "Internal database error"
      })
   })
}

export default ListTransactions