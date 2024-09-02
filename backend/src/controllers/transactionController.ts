import { FastifyInstance } from "fastify";
import { handleNewConnection } from "../sse/connectionHandler";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { Client } from "pg";
import { broadcastData } from "../sse/dataBroadcaster";
import { getTransactionHtml } from "../utils/objectToHTMLHandler";
import transaction from "../models/transactionModel";
import { dbQuery } from "../database/dbQuery";
import { checkTransaction } from "../utils/transactionsChecker";

export async function initTransactionEndpoints(SSEManager: SSEManager,server: FastifyInstance, db: Client) {
    // html endpoint to get transactions list
    server.get("/api/get_transactions",async (request,reply) => {
        await handleNewConnection(SSEManager,request,reply,"api/get_transactions");
        broadcastData(SSEManager,"api/get_transactions",await getTransactionHtml(db));
    });
    // json endpoint to get transactions list
    server.get("/api/transactions", async () => {
        const transactions:Array<transaction> = await dbQuery(db,"select * from transactions order by date;");
        return JSON.stringify(transactions);
    });

    server.post("/api/make_transaction", async (request,reply) => {
        await checkTransaction(request,reply,SSEManager,db);
    });

    // json endpoint for making transactions
    server.post("/api/transactions", async (request,reply) => { 
        await checkTransaction(request,reply,SSEManager,db);
    });
}   