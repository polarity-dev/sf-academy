import { Router } from "express";
import mysql from "mysql2";
import 'dotenv/config';

const connection = mysql.createConnection({
  host: process.env.DBIP,
  user: process.env.DBUSER,
  password: process.env.DBPASSWD,
  database: process.env.DB,
});
connection.connect();

const pending = Router();

pending.get("/pendingData", (req, res) => {
  connection.query(`SELECT data FROM rawData`, (err, rows) => {
    if (err) {
      res.status(400);
      res.json({
        error: "DB ERROR",
      });
    } else {
      const array: string[] = [];
      const result: { data: string}[] = Object.values(JSON.parse(JSON.stringify(rows)));
      result.forEach((element) => {
        array.push(element.data);
      });

      res.json(array);
    }
  });
});


export default pending;