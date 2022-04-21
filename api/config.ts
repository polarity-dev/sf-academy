import { join } from "path"
import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
   dotenv.config({ path: join(__dirname, "../../.env.dev") })
}

export const 
   tokenSecret = process.env.TOKEN_SECRET,
   apiPort = process.env.API_PORT,
   apiHost = process.env.API_HOST,
   exchangePort = process.env.EXCHANGE_PORT,
   exchangeHost = process.env.EXCHANGE_HOST,
   usersPort = process.env.USERS_PORT,
   usersHost = process.env.USERS_HOST,
   clientPort = process.env.CLIENT_PORT,
   clientHost = process.env.CLIENT_HOST