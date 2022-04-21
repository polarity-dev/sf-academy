import { join } from "path"
import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
   dotenv.config({ path: join(__dirname, "../.env.dev") })
}

export const
   clientPort = process.env.CLIENT_PORT,
   apiHost = process.env.API_HOST,
   apiPort = process.env.API_PORT,
   clientHost = process.env.CLIENT_HOST