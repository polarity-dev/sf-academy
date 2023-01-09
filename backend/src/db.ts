
import mysql from "mysql2";


const pool = mysql.createPool({

  host: 'mysqldb',
  user: 'root',
  password: 'password',
  database: 'database'
}).promise()



export async function initializeDB() {
  const response = await pool.query(`CREATE TABLE IF NOT EXISTS sf_saved_data (id integer PRIMARY KEY AUTO_INCREMENT, K integer, D VARCHAR(255), UNIX_TS BIGINT);`)

  return response
}

export async function getSavedData(from: string, limit: number) {
  const [rows] = await pool.query(`SELECT K, D
                FROM database.sf_saved_data
                WHERE UNIX_TS > ? 
                ORDER BY UNIX_TS DESC 
                LIMIT ? ;`, [from, limit])

  let result: any = rows;

  return result;

}


export async function insertData(K: number, D: string, timestamp: number) {
  let response = await pool.query("INSERT INTO sf_saved_data (K, D, UNIX_TS) VALUES (?, ?, ?);",
    [K, D, timestamp]
  );
  return response;

}
