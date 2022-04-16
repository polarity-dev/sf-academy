import usersClient from "../../../grpcClients/usersClient"
import { NextFunction, Request, Response } from "express"
import { decode, JwtPayload } from "jsonwebtoken"
import { ServiceError } from "@grpc/grpc-js"
import { GetUserResponse__Output } from "../../../proto/usersPackage/GetUserResponse"

const getUser = (req: Request, res: Response, next: NextFunction) => {
   const token: string = req.headers.authorization?.replace("Bearer ", "") as string
   const { userId } = decode(token) as JwtPayload
   usersClient.GetUser({ userId },
      (err: ServiceError | null, data: GetUserResponse__Output | undefined) => {
      if (err) {
         next(err)
         return
      }
      res.status(200).send(data)
   })
}

export default getUser
