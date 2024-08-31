import { Client } from "pg";
import { dbQuery } from "../database/dbQuery";
import { env } from "process";
import transaction from "../models/transactionModel";
import { broadcastData } from "../sse/dataBroadcaster";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { getBudgetHtml, getCryptoHtml, getTransactionHtml } from "./objectToHTMLHandler";
import { delay } from "./delayManager";

export async function processBatchTransactions(SSEManager: SSEManager,db: Client) {
    const PROCESS_BATCH_SIZE = env.PROCESS_BATCH_SIZE ?? 5;
    const transactions:Array<transaction> = await dbQuery(db,`select * from transactions where state = 'pending' order by date limit $1;`,[Number(PROCESS_BATCH_SIZE)]);
    if (transactions.length == 0) { return; }
    var budget = (await dbQuery(db,`select * from budget;`))[0].budget;
    for (const transaction of transactions) {
        const price = transaction.price;
        var quantity = transaction.quantity;
        const symbol = transaction.symbol;
        const id = transaction.id;
        if (quantity > 0) {
            if (budget >= price * quantity) {
                budget -= price * quantity;
                await dbQuery(db,`update cryptos set owned = owned + $1 where symbol = $2;`,[quantity,symbol]);
                await dbQuery(db,`update transactions set state = 'success' where id = $1;`,[id]);
            } else {
                await dbQuery(db,`update transactions set state = 'failed' where id = $1;`,[id]);
            }
        } else { 
            quantity = -quantity;
            const previous_owned = (await dbQuery(db,"select * from cryptos where symbol = $1;",[symbol]))[0].owned;
            if (previous_owned >= quantity) {
                budget += price * quantity;
                await dbQuery(db,`update cryptos set owned = owned + $1 where symbol = $2;`,[-quantity,symbol]);
                await dbQuery(db,`update transactions set state = 'success' where id = $1;`,[id]);
            } else {
                await dbQuery(db,`update transactions set state = 'failed' where id = $1;`,[id]);
            }
        }
    }
    await dbQuery(db,`update budget set budget = $1;`,[budget]);
    broadcastData(SSEManager,"api/get_cryptos",await getCryptoHtml(db));
    broadcastData(SSEManager,"api/get_transactions",await getTransactionHtml(db));
    broadcastData(SSEManager,"api/budget",await getBudgetHtml(db));
}

export async function processTransactions(SSEManager:SSEManager,db: Client) {
    const DELAY_QUEUE_PROCESSING_MS = env.DELAY_QUEUE_PROCESSING_MS ?? 20000;
    while(true) {
        await processBatchTransactions(SSEManager,db);
        await delay(Number(DELAY_QUEUE_PROCESSING_MS));
    }
}