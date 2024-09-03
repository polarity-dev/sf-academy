import { FastifyInstance } from "fastify";
import { handleNewConnection } from "../sse/connectionHandler";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { Client } from "pg";
import { broadcastData } from "../sse/dataBroadcaster";
import { getTransactionHtml } from "../utils/objectToHTMLHandler";
import { checkTransaction } from "../utils/transactionsChecker";
import { getTable } from "../database/dbQueries";
import { handleTransaction } from "../utils/transactionsHandler";

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
        const check_response = await checkTransaction(request,db);
        if (check_response.success && check_response.crypto && check_response.quantity) {
            const handle_response = await handleTransaction(SSEManager,db,check_response.crypto,check_response.quantity);
            reply.send(handle_response);
            // do something if this does not work
        } else {
            reply.send(check_response.error);
        }
    });
    
    // json endpoint to get transactions list
    server.get("/api/transactions", async (request,reply) => {
        const response = await getTable(db,"transactions","date");
        if (response.success && response.data) {
            reply.send(JSON.stringify(response.data));
        } else {
            reply.send("Internal server error.");
        }
    });

    // json endpoint to make a transaction
    server.post("/api/transactions", async (request,reply) => { 
        const check_response = await checkTransaction(request,db);
        if (check_response.success && check_response.crypto && check_response.quantity) {
            const handle_response = await handleTransaction(SSEManager,db,check_response.crypto,check_response.quantity);
            reply.send(handle_response);
            // do something if this does not work
        } else {
            reply.send(check_response.error);
        }
    });
}   