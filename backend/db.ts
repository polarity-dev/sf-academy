import { Pool } from 'pg'

export const pool = new Pool({
  user: 'db_user',
  host: 'postgres',
  database: 'academyDB',
  password: 'db_pass',
  port: 5432,
})

export const query = (text, params?) => {
  return pool.query(text, params)
}
