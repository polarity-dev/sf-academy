import express, { Application, Request, Response } from "express";
import cron from "node-cron";
import * as buffer from "./singleton_buffer";
import * as db from "./db"

const app: Application = express();
const port = 3000;

// app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Ciao!");
});

// use express.text() to set the header to "text/plain"
app.post(
  "/importDataFromFile",
  express.text(),
  (req: Request, res: Response) => {
    const plainText: string = req.body;
    // we split each line when there's a carriage return
    const lines: string[] = plainText.split(/\r?\n/);
    const A: number = Number(lines[0].split(" ")[0]);
    const B: number = Number(lines[0].split(" ")[1]);

    for (let i: number = A; i <= B; i++) {
      const line: string[] = lines[i].split(" ");
      const P: number = Number(line[0]);
      const K: number = Number(line[1]);
      const D: string = line[2];

      buffer.default.push(P, [K, D]);
    }

    return res.status(201).send();
  }
);

app.get("/pendingData", express.json(), (req: Request, res: Response) => {
  res.send({ data: buffer.default.getAll() })
  res.end()
})

app.get("/data", express.json(), async (req: Request, res: Response) => {
  let from = req.query.from;
  const limit = req.query.limit;
  let result;

  if (limit !== undefined && from !== undefined)
    result = await db.query('SELECT * FROM Messages WHERE t >= $1 ORDER BY t DESC LIMIT $2', [from, limit]);
  else if (limit !== undefined)
    result = await db.query('SELECT * FROM Messages ORDER BY t DESC LIMIT $1', [limit]);
  else if (from !== undefined)
    result = await db.query('SELECT * FROM Messages WHERE t >= $1 ORDER BY t DESC', [from]);
  else
    result = await db.query('SELECT * FROM Messages ORDER BY t DESC');

  res.send({ data: result.rows })
  res.end()
})

// use db transaction to improve performance
cron.schedule("*/10 * * * * *", async () => {
  let N = 0;
  let i = 5; // we start from the highest priority
  let timestamp = new Date();
  let messageLine = undefined;
  const client = await db.pool.connect()

  try {
    await client.query('BEGIN');

    while (N < 15 && i > 0) {
      N++;
      messageLine = buffer.default.pop(i);

      // undefined means that there are no messages left with that priority
      if (messageLine === undefined) i--;
      else {
        const queryText: string = "INSERT INTO Messages (k, d, t) VALUES ($1, $2, $3)";
        const queryValues: any = [messageLine[0], messageLine[1], timestamp];

        await client.query(queryText, queryValues);
      }
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.log(e);
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
