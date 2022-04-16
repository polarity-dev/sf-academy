import { Knex } from "knex"
import { dbHost, dbPort, dbUser, dbPassword, dbName } from "./config"

console.log(dbName)

const knexConfig: Knex.Config = {
   client: "pg",
   connection: {
      host: dbHost,
      port: parseInt(dbPort as string),
      user: dbUser,
      password: dbPassword,
      database: dbName
   }
}

export default knexConfig