import { FastifyInstance } from "fastify";
import { handleNewConnection } from "../sse/connectionHandler";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { Client } from "pg";
import { broadcastData } from "../sse/dataBroadcaster";
import { getTransactionHtml } from "../utils/objectToHTMLHandler";
import { checkTransaction } from "../utils/transactionsChecker";
import { getTable } from "../database/dbQueries";

export async function initTransactionEndpoints(SSEManager: SSEManager,server: FastifyInstance, db: Client) {
    // html endpoint to get transactions list
    server.get("/api/get_transactions",async (request,reply) => {
        await handleNewConnection(SSEManager,request,reply,"api/get_transactions");
        const response = await getTransactionHtml(db);
        if (response.success && response.data) {
            broadcastData(SSEManager,"api/get_transactions",response.data);
        }
    });
    // html endpoint to make a transaction 
    server.post("/api/make_transaction", async (request,reply) => {
        await checkTransaction(request,reply,SSEManager,db);
    });
    
    // json endpoint to get transactions list
    server.get("/api/transactions", async () => {
        const response = await getTable(db,"transactions","date");
        if (response.success && response.data) {
            return JSON.stringify(response.data);
        } else {
            return "Internal server error.";
        }
    });

    // json endpoint to make a transaction
    server.post("/api/transactions", async (request,reply) => { 
        await checkTransaction(request,reply,SSEManager,db);
    });
}   