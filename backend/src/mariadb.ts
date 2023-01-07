
import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: 'localhost:3306',
  user: 'root',
  password: 'password',
  database: 'foo'
})

export default pool;
