import { join } from "path"
import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
   dotenv.config({ path: join(__dirname, "../../.env.dev") })
}

export const 
   tokenSecret = process.env.TOKEN_SECRET,
   exchangeHost = process.env.EXCHANGE_HOST,
   exchangePort = process.env.EXCHANGE_PORT,
   usersPort = process.env.USERS_PORT,
   dbPort = process.env.DB_PORT,
   dbHost = process.env.DB_HOST,
   dbUser = process.env.DB_USER,
   dbPassword = process.env.DB_PASSWORD,
   dbName = process.env.DB_NAME
