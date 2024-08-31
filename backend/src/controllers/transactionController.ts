import { FastifyInstance } from "fastify";
import { handleNewConnection } from "../sse/connectionHandler";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { Client } from "pg";
import { broadcastData } from "../sse/dataBroadcaster";
import { getTransactionHtml } from "../utils/objectToHTMLHandler";
import transaction from "../models/transactionModel";
import { dbQuery } from "../database/dbQuery";
import transactionSchema from "../models/transactionJSONSchema";

export async function initTransactionController(SSEManager: SSEManager,server: FastifyInstance, db: Client) {
    // html endpoint to get transactions list
    server.get("/api/get_transactions",async (request,reply) => {
        await handleNewConnection(SSEManager,request,reply,"api/get_transactions");
        const transactions:Array<transaction> = await dbQuery(db,"select * from transactions order by date;");
        broadcastData(SSEManager,"api/get_transactions",getTransactionHtml(transactions));
    });
    // json endpoint to get transactions list
    server.get("/api/transactions", async () => {
        const transactions:Array<transaction> = await dbQuery(db,"select * from transactions order by date;");
        return JSON.stringify(transactions);
    });
    // json endpoint for making transactions
    server.post("/api/transactions", { schema: { body: transactionSchema } }, async (request,reply) => { 

        const { action, symbol, quantity = 1 } = request.body as { action: string, symbol: string, quantity: number };
        console.log(action,symbol,quantity);
        
    });
}   