import { join } from "path"
import dotenv from "dotenv"

const ENV_FILE = (process.env.NODE_ENV === "production") ? ".env" : ".env.dev"

dotenv.config({ path: join(__dirname, "..", ENV_FILE) })

export const 
   apiPort = process.env.API_PORT,
   apiHost = process.env.API_HOST,
   exchangePort = process.env.EXCHANGE_PORT,
   exchangeHost = process.env.EXCHANGE_HOST,
   usersPort = process.env.USERS_PORT,
   usersHost = process.env.USERS_HOST,
   baseUrl = `http://${apiHost}:${apiPort}/api`