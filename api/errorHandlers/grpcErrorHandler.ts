import { status } from "@grpc/grpc-js"
import { ErrorRequestHandler } from "express"

const grpcErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
   switch (err.code) {
      case (status.UNAUTHENTICATED): {
         res.status(401).send({ message: "Invalid credentials" })
         break
      }
      default: {
         next(err)
         break
      }
   }
}

export default grpcErrorHandler