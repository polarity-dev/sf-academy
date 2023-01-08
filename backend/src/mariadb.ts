
import mariadb from "mariadb";

const pool: mariadb.Pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'database'
})

export default pool;


