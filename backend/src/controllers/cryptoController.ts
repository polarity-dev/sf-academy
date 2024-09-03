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
    // html endpoint for the cryptos in the dashboard
    server.get("/api/get_cryptos", async (request,reply) => {
        const DELAY_PRICE_MODIFICATION_MS = env.DELAY_PRICE_MODIFICATION_MS ?? "1000";
        const signal = await handleNewConnection(SSEManager,request,reply,"api/get_cryptos");
        while (!signal.aborted) {
            try {
                const response = await getCryptoHtml(db);
                if (response.success && response.data) {
                    broadcastData(SSEManager,"api/get_cryptos",response.data);
                    await delay(Number(DELAY_PRICE_MODIFICATION_MS));
                }
            } catch (error) {
                if (signal.aborted) {
                    console.log("Loop terminated due to abort signal");
                } else {
                    console.error(error);
                }
            } 
        }
    });
    // json crypto get endpoint
    server.get("/api/crypto", async () => {
        const response = await getTable(db,"cryptos","id");
        if (response.success && response.data) {
            return JSON.stringify(response.data);
        } else {
            return "Internal server error";
        }
    });
};