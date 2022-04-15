import usersClient from "../grpc_clients/usersClient"
import { ServiceError } from "@grpc/grpc-js"
import { NextFunction, Request, Response } from "express"
import { LoginResponse__Output } from "../../../proto/usersPackage/LoginResponse"

const login = (req: Request, res: Response, next: NextFunction) => {
   const email: string = req.body.email as string
   const password: string = req.body.password as string
   usersClient.Login({
      email,
      password
   }, (err: ServiceError | null, data: LoginResponse__Output | undefined) => {
      if (err) {
         next(err)
         return
      }
      res.status(201).send(data)
   })
}

export default login
