import { Client } from "pg";
import { broadcastData } from "../sse/dataBroadcaster";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { getTransactionHtml } from "./objectToHTMLHandler";
import crypto from "../models/cryptoModel";
import { dbQuery } from "../database/dbQueries";

export async function handleTransaction(SSEManager: SSEManager, db: Client, crypto: crypto, quantity: number) {
    const insert_response = await dbQuery(db,"insert into transactions (symbol,quantity,price) values ($1,$2,$3);",[crypto.symbol,quantity,crypto.price]);
    if (insert_response.success == false) {
        return "Internal server error.";
    }
    const response = await getTransactionHtml(db);
    if (response.success && response.data) {
        broadcastData(SSEManager,"api/get_transactions",response.data);
        return "the transaction was successfully inserted in the queue";
    } else {
        return "Internal server error.";
    }
}
