import { Router } from "express";
import mysql from "mysql2";
import multer from "multer";
import util from "util";
import axios from "axios";
import "dotenv/config";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const importFile = Router();

const connection = mysql.createConnection({
  host: process.env.DBIP,
  user: process.env.DBUSER,
  password: process.env.DBPASSWD,
  database: process.env.DB,
});
connection.connect();

const query = util.promisify(connection.query).bind(connection);

importFile.post(
  "/importDataFromFile",
  upload.single("textfile"),
  async function (req, res) {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "http://localhost:" + process.env.FRONTPORT
    );
    const incomingFile = String(req.file.buffer).replace(/\r/g, "").split("\n");
    let startingIndex = parseInt(incomingFile[0].split(" ")[0]);
    const endingIndex = parseInt(incomingFile[0].split(" ")[1]);

    let prepareStatement = "";
    const items: string[] = [];
    for (startingIndex; startingIndex <= endingIndex; startingIndex++) {
      items.push(incomingFile[startingIndex][0], incomingFile[startingIndex]);
      prepareStatement = prepareStatement + `(?, ?, UNIX_TIMESTAMP(now())),`;
    }
    prepareStatement = `INSERT INTO rawData (priority, data, loadedAt) VALUES ${prepareStatement.slice(
      0,
      -1
    )}`;

    let success = true;
    try {
      await query(prepareStatement, items);
    } catch (e) {
      success = false;
      console.error(e);
    }
    if (success) {
      try {
        await axios.get("http://worker:" + process.env.WORKERPORT);
      } catch {
        console.error("WORKER IS DEAD");
      }
      res.json({
        query: "OK",
      });
    } else {
      res.status(400);
      res.json({
        error: "DB ERROR",
      });
    }
  }
);

export default importFile;
