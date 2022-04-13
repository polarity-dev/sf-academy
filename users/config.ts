import { join } from "path"
import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
   dotenv.config({ path: join(__dirname, "../../.env.dev") })
}

export const 
   tokenSecret = process.env.TOKEN_SECRET,
   usersPort = process.env.USERS_PORT,
   dbPassword = process.env.DB_PASSWORD,
   dbPort = process.env.DB_PORT,
   dbHost = process.env.DB_HOST
