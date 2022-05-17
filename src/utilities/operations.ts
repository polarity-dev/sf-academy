const e = module.exports
import { Request, Response } from "express"
import { Pool } from "pg"
import format from "pg-format"
import fileUpload from "express-fileupload"
require("dotenv").config()
const { splitter } = require("./splitter")

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT!)
})


function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}


e.importFromFile = async(req: Request, res: Response): Promise<void> => {
  try {
    if (req.files && req.files !== null) { // CONTROLLAREEEEEE
      if (req.files["dataFile"]) {
        var buffer = req.files.dataFile as fileUpload.UploadedFile
        var data = buffer.data
        var splitted = await splitter(data)
        var resp = await db.query(format("INSERT INTO pending_data (priority, int_k, str_d) VALUES %L", splitted), [])
        if (resp.rowCount === splitted.length) {
          res.status(200).send("File proccessed")
        } else if (resp.rowCount > 0) {
          res.status(200).send("File processed, but some rows could bee lost")
        } else {
          res.status(500).send("Error during quering of the datas")
        }
      } else {
        res.status(409).send({ code: 409, message: "Check file name" })
      }
    } else {
      res.status(400).send("File required")
    }
  } catch (err) {
    console.log(err)
    res.status(500).send("Server Error")
  }
}

e.processData = async(): Promise<void> => {
  while (true) {
    const query =
      `WITH moved_rows AS (
        DELETE FROM pending_data a
        WHERE ctid IN (
            SELECT ctid
            FROM pending_data
            ORDER BY priority DESC, timestamp ASC
            LIMIT 15
        )
        RETURNING a.int_k, a.str_d -- or specify columns
      )
      INSERT INTO processed_data (int_k, str_d)
      SELECT * FROM moved_rows;`
    try {
      await db.query(query, []).then(() => console.log("data processed"))
    } catch (err) {
    }
    await delay(10000)
  }
}

e.getPendingData = async(req: Request, res: Response): Promise<void> => {
  try {
    const resp = await db.query("SELECT * FROM pending_data")
    res.status(200).json(resp.rows)

  } catch (err) {
    res.status(500).send("Server error")
  }
}

e.getProcessedData = async(req: Request, res: Response): Promise<void> => {
  try {
    var query = "SELECT * FROM processed_data"
    if (req.query.from) {
      query = query + " WHERE timestamp > '" + req.query.from + "'"
    }
    query = query + " ORDER BY timestamp ASC"
    if (req.query.limit && parseInt(req.query.limit as string) > 0) {

      query = query + " LIMIT " + req.query.limit
    }
    const resp = await db.query(query, [])
    res.status(200).json(resp.rows)
  } catch (err) {
    res.status(500).send("Server error")
  }
}