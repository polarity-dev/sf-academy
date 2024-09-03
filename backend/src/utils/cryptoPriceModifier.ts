import { Client } from "pg";
import { delay } from "./delayManager";
import { env } from "process";
import { dbQuery } from "../database/dbQueries";

export async function modifyPrices(db: Client) {
    const DELAY_PRICE_MODIFICATION_MS = env.DELAY_PRICE_MODIFICATION_MS ?? "1000";
    const PRICE_MODIFICATION_PERCENTAGE = env.PRICE_MODIFICATION_PERCENTAGE ?? "5";
    while(true) {
        const response = await dbQuery(db,`update cryptos set price = randomInRange(price * ${1 - Number(PRICE_MODIFICATION_PERCENTAGE) / 100}, price * ${1 + Number(PRICE_MODIFICATION_PERCENTAGE) / 100});`); 
        // maybe add some if the query doesn't work ? 
        await delay(Number(DELAY_PRICE_MODIFICATION_MS));
    }
}