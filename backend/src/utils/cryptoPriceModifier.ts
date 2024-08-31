import { Client } from "pg";
import { delay } from "./delayManager";
import { dbQuery } from "../database/dbQuery";
import { env } from "process";

const DELAY_PRICE_MODIFICATION_MS = env.DELAY_PRICE_MODIFICATION_MS ?? 1000;

export async function modifyPrices(db: Client) {
    while(true) {
        await dbQuery(db,"update cryptos set price = randomInRange(price * 0.95, price * 1.05);");
        await delay(Number(DELAY_PRICE_MODIFICATION_MS));
    }
}