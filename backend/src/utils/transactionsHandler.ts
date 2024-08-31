import { Client } from "pg";
import { dbQuery } from "../database/dbQuery";
import transaction from "../models/transactionModel";
import { broadcastData } from "../sse/dataBroadcaster";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { getTransactionHtml } from "./objectToHTMLHandler";

export async function handleTransaction(SSEManager: SSEManager, db: Client, symbol: string,quantity: number) {
    const response = await dbQuery(db,"select * from cryptos where symbol = $1", [symbol]); 
    if (response.length == 0) {
        return `the crypto ${symbol} does not exist :(`;
    }
    const data = response[0];
    await dbQuery(db,`insert into transactions (symbol,quantity,price) values ('${data.symbol}',${quantity},${data.price});`);
    const transactions:Array<transaction> = await dbQuery(db,"select * from transactions order by date;");
    broadcastData(SSEManager,"api/get_transactions",getTransactionHtml(transactions));
    return "the transaction was successfully inserted in the queue";
}
