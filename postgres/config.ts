import { join } from "path"
import dotenv from "dotenv"

const ENV_FILE = (process.env.NODE_ENV === "production") ? ".env" : ".env.dev"

dotenv.config({ path: join(__dirname, "../..", ENV_FILE)})

export const
   dbPort = process.env.DB_PORT,
   dbHost = process.env.DB_HOST,
   dbUser = process.env.DB_USER,
   dbPassword = process.env.DB_PASSWORD,
   dbName = process.env.DB_NAME