import { Client } from "pg";
import { env } from "process";
import transaction from "../../models/transactionModel";
import { broadcastData } from "../../sse/dataBroadcaster";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { getBudgetHtml, getCryptoHtml, getTransactionHtml } from "../objectToHTMLHandler";
import { delay } from "../delayManager";
import { dbQuery } from "../../database/dbQueries";

export async function processBatchTransactions(SSEManager: SSEManager,db: Client) {
    const PROCESS_BATCH_SIZE = env.PROCESS_BATCH_SIZE ?? 5;
    let response = await dbQuery(db,`select * from transactions where state = 'pending' order by date limit $1;`,[Number(PROCESS_BATCH_SIZE)]);
    if (response.success == false || !response.data) {
        return;
    }
    const transactions:Array<transaction> = response.data;
    if (transactions.length == 0) { return; }
    response = (await dbQuery(db,`select * from budget;`));
    if (response.success == false || !response.data) {
        return;
    }
    var budget = response.data[0].budget;
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
            response = (await dbQuery(db,"select * from cryptos where symbol = $1;",[symbol]));
            if (response.success == false || !response.data) {
                return;
            }
            const previous_owned = response.data[0].owned;
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
    const crypto_response = await getCryptoHtml(db);
    if (crypto_response.success && crypto_response.data) {
        broadcastData(SSEManager,"api/get_cryptos",crypto_response.data);
    }
    const transaction_response = await getTransactionHtml(db);
    if (transaction_response.success && transaction_response.data) {
        broadcastData(SSEManager,"api/get_transactions",transaction_response.data);
    }
    const budget_response = await getBudgetHtml(db);
    if (budget_response.success && budget_response.data) {
        broadcastData(SSEManager,"api/budget",budget_response.data);
    }
}

export async function processTransactions(SSEManager:SSEManager,db: Client) {
    const DELAY_QUEUE_PROCESSING_MS = env.DELAY_QUEUE_PROCESSING_MS ?? 20000;
    while(true) {
        await processBatchTransactions(SSEManager,db);
        await delay(Number(DELAY_QUEUE_PROCESSING_MS));
    }
}