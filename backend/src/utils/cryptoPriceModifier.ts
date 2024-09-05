import { Client } from "pg";
import { delay } from "./delayManager";
import { env } from "process";
import { dbQuery } from "../database/dbQueries";
import { getCryptoHtml } from "./objectToHTMLHandler";
import { broadcastData } from "../sse/dataBroadcaster";
import { SSEManager } from "@soluzioni-futura/sse-manager";

// modifies and shows the crypto prices periodically
export async function modifyPrices(SSEManager: SSEManager,db: Client) {
    const DELAY_PRICE_MODIFICATION_MS = env.DELAY_PRICE_MODIFICATION_MS ?? "60000";
    const PRICE_MODIFICATION_PERCENTAGE = env.PRICE_MODIFICATION_PERCENTAGE ?? "5";
    while(true) {
        const modify_response = await dbQuery(db,`update cryptos set price = randomInRange(price * ${1 - Number(PRICE_MODIFICATION_PERCENTAGE) / 100}, price * ${1 + Number(PRICE_MODIFICATION_PERCENTAGE) / 100});`); 
        const crypto_response = await getCryptoHtml(db);
        if (crypto_response.success && crypto_response.data) {
            broadcastData(SSEManager,"api/get_cryptos",crypto_response.data);
            await delay(Number(DELAY_PRICE_MODIFICATION_MS));
        }
    }
}