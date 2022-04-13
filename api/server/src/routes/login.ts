import usersClient from "../grpc_clients/usersClient"
import { Request, Response } from "express"

const login = (req: Request, res: Response) => {
   const email: string = req.body.email as string
   const password: string = req.body.password as string
   usersClient.Login({
      email,
      password
   }, (err, data) => {
      if (err) throw err
      res.status(200).send(data)
   })
}

export default login
