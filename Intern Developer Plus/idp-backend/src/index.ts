// const express = require('express');
import express, {Express, Request, Response} from "express"
import dotenv from "dotenv"
import cors from "cors"
import multer from "multer"
import {db} from "./database"

import {Processor} from "./processor";
import {IData} from "./database/models";

const tag: string = "SERVER"
const default_port: string = "8080"

const min_priority = 1
const max_priority = 5

dotenv.config()

let processor: Processor
const app: Express = express()
const port: String = process.env.PORT || default_port
// Files are not going to exceed 50 entries. We can store them in memory while processing
const upload = multer({storage: multer.memoryStorage()}).single("list")

// Priority levels can be set up to 99 if needed. That's more than enough. Priority also can't be negative
// Data with priority level outside of queue range will not be added
const fileComplianceRegex: RegExp = /^(?:\d{1,2} .*(?:\n|$))+$/

app.use(cors())

// It's responsibility of  the server to validate data
// We can make responses to user about file format issues as granular as we want this way
function check_data(data: string): [boolean, string] {
   if (!fileComplianceRegex.test(data)) {
      return [false, "Wrong file format"]
   } else {
      let split: string[] = data.trimEnd().split("\n")
      for (let line of split) {
         // I used this approach in case the priority number gets higher than 9
         let index: number = line.indexOf(" ");
         // If it passed regex, priority is a number. Conversion always works
         let priority: number = Number(line.slice(0, index))

         if (priority < min_priority || priority > max_priority) {
            return [false, "Some priority levels are out of boundaries"]
         }
      }
   }

   return [true, ""]
}

// Production endpoints

app.post('/importDataFromFile', (req: Request, res: Response) => {
   let response = ""

   upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
         console.error(`[${tag}]: Multer error: ${err}`)
         response = "Error while parsing file"
      } else if (err) {
         console.error(`[${tag}]: Unknown error while uploading: ${err}`)
         response = "Error while uploading file"
      } else {
         // Everything went fine
         if (req.file) {
            const data: string = String(req.file.buffer)
            console.debug(`[${tag}]: Data received is: `)
            console.debug(data)

            let [passed, message] = check_data(data)

            if(passed) {
               // check data and addToQueue may be similar but, they perform different tasks so their
               // implementation needs to be independent
               processor.addToQueue(data)
               response = "Upload successful"
            } else {
               response = message + ". Try re-uploading"
               console.warn(`[${tag}]: Invalid data `)
            }
         } else {
            console.error(`[${tag}]: Error while reading file or file empty`)
            response = "Error while reading file. Might be empty"
         }
      }
      // Needed or the htmx ajax request will hang
      // Header 204 means No Content, so that htmx will not substitute anything
      // res.status(204).end()
      res.send(response).end()
   })
})

app.get('/pendingData', (req: Request, res: Response) => {
   res.json(processor.getPendingDataArray()).end()
});

app.get('/data', async (req: Request, res: Response) => {
   const from = req.query.from
   const limit = req.query.limit

   console.debug(`[${tag}]: from is: ${from}`)
   console.debug(`[${tag}]: limit is: ${limit}`)

   try {
      // If safe_limit is not a number, the query will simply return everything
      // If the string is empty we set it to NaN, otherwise it would become zero during conversion
      const safe_limit: number = limit === "" ? NaN : Number(limit)
      console.debug(`[${tag}]: safe_limit is: ${safe_limit}`)
      const safe_from: Date = new Date(String(from))
      console.debug(`[${tag}]: safe_from is: ${safe_from}`)

      const data: IData[] = await db.data.get_all(safe_limit, safe_from)
      console.log(`[${tag}]: Values fetched`)

      res.json(data).end()
      return
   } catch (err: any) {
      console.error(`[${tag}]: Error while fetching values: ${err}`)
      res.json([]).end()
   }
});

let server = app.listen(port, async() => {
   // If the table doesn't exist, we create it
   try {
      await db.data.create()
      console.log(`[${tag}]: Database initialized`)
   } catch ( err: any) {
      console.error(`[${tag}]: Error while creating table: ${err}`)
      server.close()
      return
   }

   processor = new Processor(min_priority, max_priority)
   console.log(`[${tag}]: Server is running at http://localhost:${port}`)
})