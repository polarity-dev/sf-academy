import Fastify from "fastify";
import { initializeSSEManager } from "./sse/sseInitializer";
import path from "path";
import { readFileSync } from "fs";
import { initCryptoEndpoints } from "./controllers/cryptoController";
import db from "./database/dbInit";

async function setup() {

    const { ADDRESS = 'localhost', PORT = '3000' } = process.env;

    const server = Fastify({logger: true});
    
    const SSEManager = await initializeSSEManager();

    // serves html file
    server.get("/", function (request,reply) {
        const htmlPath = path.join(__dirname,"../public/index.html");
        const htmlContent = readFileSync(htmlPath,"utf-8");
        reply.type("text/html").send(htmlContent);
    });
    
    await initCryptoEndpoints(SSEManager,server,db);

    server.listen({ host: ADDRESS, port: parseInt(PORT, 10) }, (err,address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
    });
}

setup();