import { ErrorRequestHandler } from "express"

const apiErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
   switch (err.status) {
      case (400): {
         res.status(400).send({ message: "Bad Request" })
         break
      }
      case (401): {
         res.status(401).send({ message: "Invalid Token" })
         break
      }
      default: {
         next(err)
         break
      }
   }
}

export default apiErrorHandler