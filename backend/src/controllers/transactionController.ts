import { FastifyInstance } from "fastify";
import { handleNewConnection } from "../sse/connectionHandler";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { Client } from "pg";
import { broadcastData } from "../sse/dataBroadcaster";
import { getTransactionHtml } from "../utils/objectToHTMLHandler";
import { checkTransaction } from "../utils/transaction_processing/transactionsChecker";
import { getTable } from "../database/dbQueries";
import { handleTransaction } from "../utils/transaction_processing/transactionsHandler";

export async function initTransactionEndpoints(SSEManager: SSEManager,server: FastifyInstance, db: Client) {
    // endpoint html per la connessione SSE che fornisce la lista delle transazioni
    server.get("/api/get_transactions",async (request,reply) => {
        await handleNewConnection(SSEManager,request,reply,"api/get_transactions");
        const response = await getTransactionHtml(db);
        if (response.success && response.data) {
            broadcastData(SSEManager,"api/get_transactions",response.data);
        }
    });
    // endpoint html per compiere una transazione
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
    // endpoint json per ottenere la lista di transazioni
    server.get("/api/transactions", async (request,reply) => {
        const response = await getTable(db,"transactions","date");
        if (response.success && response.data) {
            reply.send(JSON.stringify(response.data));
        } else {
            reply.send("Internal server error.");
        }
    });
    // endpoint json per fare una transazione
    server.post("/api/transactions", async (request,reply) => { 
        const check_response = await checkTransaction(request,db);
        if (check_response.success && check_response.crypto && check_response.quantity) {
            const handle_response = await handleTransaction(SSEManager,db,check_response.crypto,check_response.quantity);
            reply.send(handle_response);
        } else {
            reply.send(check_response.error);
        }
    });
}   