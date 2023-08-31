import { Request, Response } from "express"
import * as db from "./db"

const importDataFromFile = async (req: Request, res: Response) => {
  const result = await db.query("SELECT * FROM Messages");
  return result
}
