import { Router } from "express";
import mysql from "mysql2";
import util from "util";
import 'dotenv/config';

const connection = mysql.createConnection({
  host: process.env.DBIP,
  user: process.env.DBUSER,
  password: process.env.DBPASSWD,
  database: process.env.DB,
});
connection.connect();

const query = util.promisify(connection.query).bind(connection);
const data = Router();

function delimiter(
  prepared: string,
  from: string,
  until: string
): (string | string[])[] {
  const dbFilter: string[] = [];
  if (from !== undefined && until !== undefined) {
    prepared += "WHERE parsedAt BETWEEN ? AND ?";
    dbFilter.push(from as string, until as string);
  } else if (until !== undefined) {
    prepared += "WHERE parsedAt <= ?";
    dbFilter.push(until as string);
  } else if (from !== undefined) {
    prepared += "WHERE parsedAt >= ?";
    dbFilter.push(from as string);
  }
  return [prepared, dbFilter];
}

data.get("/data", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + process.env.FRONTPORT);
  let rows: { "COUNT(*)": number }[];
  let success = true;
  let page: number;
  if (req.query.page === undefined || req.query.page === "") {
    page = 1;
  } else {
    try {
      page = parseInt(req.query.page as string);
    } catch {
      page = 1;
    }
  }

  const parsedQuery = delimiter(
    "SELECT COUNT(*) FROM parsedData ",
    req.query.from as string,
    req.query.limit as string
  );
  try {
    rows = await query(parsedQuery[0], parsedQuery[1]);
  } catch (e) {
    success = false;
    console.error(e);
    res.status(400);
    res.json({
      error: "DB ERROR",
    });
  }

  if (success) {
    const totalData = rows[0]["COUNT(*)"];
    if (rows[0]["COUNT(*)"] === 0) {
      res.json({
        totalData: rows[0]["COUNT(*)"],
        pages: 1,
        data: [],
      });
    } else {
      const sorting =
        req.query.order === "asc" || req.query.order === "ASC" ? "ASC" : "DESC"; // THE DOCS DID NOT SPECIFY IF THE ORDER SHOULD BE DESC OR ASC SO I ASK THE USER WHAT HE LIKES (DEFAULT DESC)

      const parsedPage = delimiter(
        `SELECT * FROM parsedData `,
        req.query.from as string,
        req.query.limit as string
      );

      const pagination = parsedPage[0] + ` ORDER BY parsedAt ${sorting} LIMIT 15 OFFSET ${(page-1) * 15}`
      try {
        rows = await query(
          pagination,
          parsedPage[1]
        );
      } catch (e) {
        success = false;
        console.error(e);
        res.status(400);
        res.json({
          error: "DB ERROR",
        });
      }

      if (success) {
        res.json({
          totalData: totalData,
          pages:
            totalData % 15 === 0 ? totalData / 15 : Math.ceil(totalData / 15),
          current: page,
          data: rows,
        });
      }
    }
  } else {
    console.error("db error");
  }
});

export default data;
