import { Client } from "pg";
import { dbQuery } from "../database/dbQuery";
import transaction from "../models/transactionModel";
import { broadcastData } from "../sse/dataBroadcaster";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { getTransactionHtml } from "./objectToHTMLHandler";
import crypto from "../models/cryptoModel";

export async function handleTransaction(SSEManager: SSEManager, db: Client, crypto: crypto, quantity: number) {
    await dbQuery(db,`insert into transactions (symbol,quantity,price) values ('${crypto.symbol}',${quantity},${crypto.price});`);
    const transactions:Array<transaction> = await dbQuery(db,"select * from transactions order by date;");
    broadcastData(SSEManager,"api/get_transactions",await getTransactionHtml(db));
    return "the transaction was successfully inserted in the queue";
}
