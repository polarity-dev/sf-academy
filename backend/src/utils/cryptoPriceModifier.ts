import { Client } from "pg";
import { delay } from "./delayManager";
import { dbQuery } from "../database/dbQuery";

export async function modifyPrices(db: Client) {
    while(true) {
        await dbQuery(db,"update cryptos set price = randomInRange(price * 0.95, price * 1.05);");
        await delay(1000);
    }
}