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
        // fornisce periodicamente le criptovalute, con un periodo uguale al periodo di modifica. In questo modo, ad ogni cambio di prezzo vengono mostrati
        // i prezzi aggiornati. 
        const DELAY_PRICE_MODIFICATION_MS = env.DELAY_PRICE_MODIFICATION_MS ?? "1000";
        const signal = await handleNewConnection(SSEManager,request,reply,"api/get_cryptos");
        while (!signal.aborted) { // Interrompe il flusso di informazioni se la connessione viene chiusa (e.g. quando l'utente chiude la dashboard)
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