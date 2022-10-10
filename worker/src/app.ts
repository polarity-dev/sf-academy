import express from "express";
import mysql from "mysql2";
import util from "util";
const app = express();
import "dotenv/config";

const port = Number(process.env.PORT);

let working = false;

const connection = mysql.createConnection({
  host: process.env.DBIP,
  user: process.env.DBUSER,
  password: process.env.DBPASSWD,
  database: process.env.DB,
  multipleStatements: true,
});

connection.connect();

const wait = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));
const query = util.promisify(connection.query).bind(connection);

interface RawDataElement {
  id: number;
  priority: number;
  data: string;
  loadedAt: number;
}

async function getAvailableTasks(): Promise<number> {
  let rows: { "COUNT(id)": number; parsedAt: number }[];
  let success = true;
  try {
    rows = await query(
      `SELECT COUNT(id), parsedAt FROM parsedData WHERE parsedAt > ${
        Math.round(Date.now() / 1000) - 10
      } GROUP BY parsedAt ORDER BY parsedAt ASC`
    );
  } catch (e) {
    success = false;
    console.error(e);
  }
  if (success) {
    const availableTasks = 4 - rows.length; // qya devo mettere 15
    if (availableTasks !== 0) {
      // I HAVE TASKS SO I CAN SEND THEM IMMEDIATELY TO PARSEBLOCK FUNCTION
      return availableTasks;
    } else {
      // I DONT HAVE AVAILABLE TASKS IN THIS BLOCK OF TIME SO I HAVE TO WAIT X SECONDS BEFORE GOING AHEAD
      const toWait = 10 - (Math.round(Date.now() / 1000) - rows[0].parsedAt);
      await wait(toWait);
      // AFTER WAITING I CAN NOW SEND 15 - TASKS PARSED IN THE FIRST BLOCK OF THE LAST 10 SECONDS
      return rows[0]["COUNT(id)"];
    }
  }
}

async function parseBlock() {
  working = true;
  while (working) {
    const amount = await getAvailableTasks();
    let success = true;
    let rows: RawDataElement[];
    try {
      rows = await query(
        `SELECT * FROM rawData ORDER BY priority DESC, loadedAt ASC LIMIT ${amount}`
      );
    } catch (e) {
      success = false;
      console.error(e);
      continue;
    }
    if (success) {
      if (rows.length === 0) {
        // IF I DON'T GET TASKS THAT MEANS I DON'T HAVE TASKS INSIDE MY RAWDATA TABLE
        working = false;
      } else {
        // I PARSE THE DATA AS REQUESTED
        let addData = "";
        const toAdd: (string | number)[] = [];
        let deleteData = "";
        const timestamp = Math.round(Date.now() / 1000);
        rows.forEach((element) => {
          const splitString = element.data.split(" ");
          const number = splitString[1];
          splitString.splice(0, 2);
          const joinedString = splitString.join(" ");
          deleteData += `${element.id.toString()},`;
          addData = addData + `(?, ?, ?),`;
          toAdd.push(number, joinedString, timestamp);
        });
        deleteData = deleteData.slice(0, -1);
        addData = addData.slice(0, -1);

        // I DO THE ENTIRE WORK IN ONE CALL ONLY TO OPTIMIZE TIME STILL PREVENTING SQL INJECTION
        const prepared = `INSERT INTO parsedData (number, string, parsedAt) VALUES ${addData};  DELETE FROM rawData WHERE id IN (${deleteData});`;

        try {
          rows = await query(prepared, toAdd);
        } catch (e) {
          console.error(e);
          continue;
        }
      }
    }
  }
}

app.get("/", (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 'http://localhost:' + process.env.PUBLICPORT
  if (!working) {
    // PUBLIC SERVER SENDS REQUEST AND THE WORKER STARTS TO WORK
    res.json({
      query: "OK",
    });
    parseBlock();
  } else {
    // IF THE WORKER IS ALREADY WORKING IT GET AN "ALREADY WORKING" RESPONSE
    res.json({
      status: "ALREADY WORKING",
    });
  }
});

app.listen(port, async () => {
  try{
  await query(
    `CREATE TABLE IF NOT EXISTS rawData (ID int NOT NULL, priority int NOT NULL, data text NOT NULL, loadedAt int NOT NULL, PRIMARY KEY (ID)); CREATE TABLE IF NOT EXISTS parsedData (ID int NOT NULL, number int NOT NULL, string text NOT NULL, parsedAt int NOT NULL, PRIMARY KEY (ID));`
  );
  } catch (e){
    console.error(e);
    process.exit();
  }
  parseBlock(); // IN CASE OF CRASH, I RUN A PARSEBLOCK INSTANCE WHEN THE WORKER GET STARTED
  return console.log(`Worker is listening at http://localhost:${port}`);
});
