import { FastifyInstance } from "fastify";
import { handleNewConnection } from "../sse/connectionHandler";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { delay } from "../utils/delayManager";
import { Client } from "pg";
import { broadcastData } from "../sse/dataBroadcaster";
import { getCryptoHtml } from "../utils/objectToHTMLHandler";
import { env } from "process";
import { getTable } from "../database/dbQueries";

export async function initCryptoEndpoints(SSEManager: SSEManager, server: FastifyInstance, db: Client) {
    // html endpoint per la connessione SSE che fornisce le criptovalute
    server.get("/api/get_cryptos", async (request,reply) => {
        await handleNewConnection(SSEManager,request,reply,"api/get_cryptos");
        const response = await getCryptoHtml(db);
        if (response.success && response.data) {
            broadcastData(SSEManager,"api/get_cryptos",response.data);
        }
    });
    // json endpoint che fornisce le criptovalute
    server.get("/api/crypto", async () => {
        const response = await getTable(db,"cryptos","id");
        if (response.success && response.data) {
            return JSON.stringify(response.data);
        } else {
            return "Internal server error";
        }
    });
};