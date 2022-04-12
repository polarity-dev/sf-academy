import { Request, Response } from "express"

const listTransactions = (req: Request, res: Response) => {
   res.status(200).send([
      {
         usdDelta: 100,
         eurDelta: 0,
         date: "2022-04-12T16:00:00Z"
      },
      {
         usdDelta: 0,
         eurDelta: -10,
         date: "2022-04-12T12:00:00Z"
      }
   ])
}

export default listTransactions
