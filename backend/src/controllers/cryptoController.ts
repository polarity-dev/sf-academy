import { FastifyInstance } from "fastify";
import { handleNewConnection } from "../sse/connectionHandler";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { delay } from "../utils/delayManager";
import { Client } from "pg";
import { dbQuery } from "../database/dbQuery";
import crypto from "../models/crypto";
import { broadcastData } from "../sse/dataBroadcaster";
import { getCryptoHtml } from "../utils/getHtml";
import { env } from "process";

const DELAY_PRICE_MODIFICATION_MS = env.DELAY_PRICE_MODIFICATION_MS ?? 1000;

export async function initCryptoEndpoints(SSEManager: SSEManager, server: FastifyInstance, db: Client) {
    // html endpoint for the cryptos in the dashboard
    server.get("/api/get_cryptos", async (request,reply) => {
        const signal = await handleNewConnection(SSEManager,request,reply,"api/get_cryptos");

        while (!signal.aborted) {
            try {
                const cryptos:Array<crypto> = (await dbQuery(db,"select * from cryptos"));
                broadcastData(SSEManager,"api/get_cryptos",getCryptoHtml(cryptos));
                await delay(Number(DELAY_PRICE_MODIFICATION_MS));
            } catch (error) {
                if (signal.aborted) {
                    console.log("Loop terminated due to abort signal");
                } else {
                    console.log(error);
                }
            } 
        }
    });
};