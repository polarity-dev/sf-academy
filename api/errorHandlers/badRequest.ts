import { ErrorRequestHandler } from "express"

const badRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
   res.status(400).send({ message: "Bad Request" })
   next()
}

export default badRequestHandler