import { FastifyInstance } from "fastify"; 
import { handleNewConnection } from "../sse/connectionHandler";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { Client } from "pg";
import { broadcastData } from "../sse/dataBroadcaster";
import { getBudgetHtml } from "../utils/objectToHTMLHandler";

export async function initBudgetEndpoint(SSEManager: SSEManager,server: FastifyInstance, db: Client) {
    server.get("/api/budget", async (request,reply) => {
        await handleNewConnection(SSEManager,request,reply,"api/budget");
        broadcastData(SSEManager,"api/budget",await getBudgetHtml(db));
    });
}