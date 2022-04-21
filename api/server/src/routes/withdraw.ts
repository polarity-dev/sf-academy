import usersClient from "../../../grpcClients/usersClient"
import { ServiceError } from "@grpc/grpc-js"
import { NextFunction, Request, Response } from "express"
import { WithdrawResponse__Output } from "../../../proto/usersPackage/WithdrawResponse"
import { decode, JwtPayload } from "jsonwebtoken"

const withdraw = (req: Request, res: Response, next: NextFunction) => {
   const { value, symbol } = req.body
   const token: string = req.headers.authorization?.replace("Bearer ", "") as string
   const userId = (decode(token) as JwtPayload).userId
   usersClient.Withdraw({
      userId,
      value,
      symbol
   }, (err: ServiceError | null, data: WithdrawResponse__Output | undefined) => {
      if (err) {
         next(err)
         return
      }
      res.status(201).send(data?.transaction)
   })
}

export default withdraw
