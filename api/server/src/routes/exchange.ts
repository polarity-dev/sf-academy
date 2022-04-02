import { ExchangeRequest } from "../../../proto/exchangePackage/ExchangeRequest"
import { exchangeClient } from "../grpc_clients/exchangeClient"
import { Request, Response } from "express"

module.exports = {
   exchange: (req: Request, res: Response) => {
      const value: number = parseFloat(req.query.value as string)
      const from: string = req.query.from as string
      const to: string = req.query.to as string
      console.log(value, from, to)
      exchangeClient.Exchange({
         value,
         from,
         to
      }, (err, data) => {
         if (err) throw err
         res.status(200).send(data)
      })
   }
}