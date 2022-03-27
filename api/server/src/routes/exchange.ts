import { Request, Response } from "express"

module.exports = {
   "exchange": (req: Request, res: Response) => {
      res.json({
         value: 300,
         from: "USD",
         to: "EUR"
      })
   }
}