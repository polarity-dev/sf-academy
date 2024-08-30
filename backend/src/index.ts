import Fastify from "fastify";
import { initializeSSEManager } from "./sse/sseInitializer";
import { handleNewConnection } from "./sse/connectionHandler";
import { broadcastData } from "./sse/dataBroadcaster";
import { delay } from "./utils/delayManager";
import path from "path";
import fs, { readFileSync } from "fs";
import { Client } from "pg";

async function setup() {

    const { ADDRESS = 'localhost', PORT = '3000' } = process.env;

    const client = new Client({
        user: 'myuser',
        host: 'db',
        database: 'mydatabase',
        password: 'mypassword',
        port: 5432
    });

    try {
   
        await client.connect();

        console.log((await client.query(`select * from cryptos;`)).rows);     
    } catch (err) {
        console.log(err);
    }


    const server = Fastify({logger: true});
    
    const SSEManager = await initializeSSEManager();

    // serves html file
    server.get("/", function (request,reply) {
        const htmlPath = path.join(__dirname,"../public/index.html");
        const htmlContent = readFileSync(htmlPath,"utf-8");
        reply.type("text/html").send(htmlContent);
    });

    // test
    server.get("/api/test", async function (request,reply) {
        
        const signal = await handleNewConnection(SSEManager,request,reply,"api/test");

        var count = 0;

        while (!signal.aborted) {
            try {
                broadcastData(SSEManager,"api/test",`sending for the ${count++} time`);
                await delay(1000);
            } catch (error) {
                if (signal.aborted) {
                    console.log("Loop terminated due to abort signal");
                } else {
                    console.log(error);
                }
            } 
        }

    });
    
    server.listen({ host: ADDRESS, port: parseInt(PORT, 10) }, (err,address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
    });
}

setup();