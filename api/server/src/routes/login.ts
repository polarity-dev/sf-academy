import usersClient from "../grpc_clients/usersClient"
import { ServiceError, status } from "@grpc/grpc-js"
import { Request, Response } from "express"
import { LoginResponse__Output } from "../../../proto/usersPackage/LoginResponse"

const login = (req: Request, res: Response) => {
   const email: string = req.body.email as string
   const password: string = req.body.password as string
   usersClient.Login({
      email,
      password
   }, (err: ServiceError | null, data: LoginResponse__Output | undefined) => {
      if (!err) {
         res.status(200)
         .cookie(
            "token",
            (data as LoginResponse__Output).token as string,
            { httpOnly: true }
         )
         .send()
      }
      else if ((err as ServiceError).code === status.UNAUTHENTICATED) {
         res.status(401).send({ status: "Invalid credentials" })
      }
   })
}

export default login
