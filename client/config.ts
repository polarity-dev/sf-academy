import { join } from "path"
import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
   dotenv.config({ path: join(__dirname, "../.env.dev") })
}

export const
   externalPort = process.env.EXTERNAL_PORT,
   host = process.env.HOST,
   apiPort = process.env.API_PORT