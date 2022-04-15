import { NextFunction, Request, Response } from "express"
import usersClient from "../grpc_clients/usersClient"
import { decode, JwtPayload } from "jsonwebtoken"
import { ServiceError } from "@grpc/grpc-js"
import { ListTransactionsResponse__Output } from "../../../proto/usersPackage/ListTransactionsResponse"

const listTransactions = (req: Request, res: Response, next: NextFunction) => {
   const token: string = req.headers.authorization?.replace("Bearer ", "") as string
   const { userId } = decode(token) as JwtPayload
   usersClient.ListTransactions({ userId },
      (err: ServiceError | null, data: ListTransactionsResponse__Output | undefined) => {
      if (err) {
         next(err)
         return
      }
      res.status(200).send((data as ListTransactionsResponse__Output).transactions)
   })
}

export default listTransactions
