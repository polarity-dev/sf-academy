import { join } from "path";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
	dotenv.config({ path: join(__dirname, "../../.env.dev") });
}

export const exchangePort = process.env.EXCHANGE_PORT;
