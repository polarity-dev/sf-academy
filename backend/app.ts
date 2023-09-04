import express, { Application, Request, Response } from "express";
import cron from "node-cron";
import cors from "cors";
import multer from "multer";
import * as priority_queue from "./priority_queue";
import * as db from "./db";
import { IQueueItem } from "./types";

const app: Application = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

let storage = multer.memoryStorage();
let upload = multer({ storage: storage });

// use in-memory multer option so that we avoid storing
// our data in a file, this speeds things up
app.post(
  "/importDataFromFile",
  upload.single("data"),
  (req: Request, res: Response) => {
    const plainText: string = String(req.file.buffer);
    // we split each line when there's a carriage return
    const lines: string[] = plainText.split(/\r?\n/);
    const A: number = Number(lines[0].split(" ")[0]);
    const B: number = Number(lines[0].split(" ")[1]);

    for (let i: number = A; i <= B; i++) {
      const line: string = lines[i];
      //isolate P
      const P: number = Number(line.substring(0, line.indexOf(" ")));

      const partialLine: string = line.substring(line.indexOf(" ") + 1); // contains everything except P

      const K: number = Number(
        partialLine.substring(0, partialLine.indexOf(" "))
      );
      const D: string = partialLine.substring(partialLine.indexOf(" ") + 1);

      priority_queue.default.push({ k: K, d: D }, P);
    }

    return res.status(201).send();
  }
);

app.get("/pendingData", express.json(), (req: Request, res: Response) => {
  res.send({ data: priority_queue.default.toArray() });
  res.end();
});

app.get("/data", express.json(), async (req: Request, res: Response) => {
  let from = new Date(req.query.from.toString());
  const limit = req.query.limit;

  const result = await db.query(
    "SELECT * FROM Messages WHERE t > $1 ORDER BY t DESC LIMIT $2",
    [from, limit]
  );

  res.send({ data: result.rows });
  res.end();
});

// use db transaction to improve performance
cron.schedule("*/10 * * * * *", async () => {
  let N = 0;
  let timestamp = new Date();
  let messageLine: IQueueItem = null;
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    while (N < 15) {
      N++;
      messageLine = priority_queue.default.pop();

      if (messageLine) {
        const queryText: string =
          "INSERT INTO Messages (k, d, t) VALUES ($1, $2, $3)";
        const queryValues: any = [messageLine.k, messageLine.d, timestamp];

        await client.query(queryText, queryValues);
      }
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
