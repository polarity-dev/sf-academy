import { join } from "path"
import dotenv from "dotenv"

const ENV_FILE = (process.env.NODE_ENV === "production") ? ".env" : ".env.dev"

if (process.env.NODE_ENV !== "production") {
   dotenv.config({ path: join(__dirname, "..", ENV_FILE) })
}


export const 
   tokenSecret = process.env.TOKEN_SECRET,
   apiPort = process.env.API_PORT,
   exchangePort = process.env.EXCHANGE_PORT,
   exchangeHost = process.env.EXCHANGE_HOST,
   usersPort = process.env.USERS_PORT,
   usersHost = process.env.USERS_HOST