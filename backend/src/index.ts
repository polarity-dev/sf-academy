import Fastify from "fastify";
import { initializeSSEManager } from "./sse/sseInitializer";
import path from "path";
import { readFileSync } from "fs";
import { initCryptoEndpoints } from "./controllers/cryptoController";
import db from "./database/dbInit";
import { modifyPrices } from "./utils/cryptoPriceModifier";
import { env } from "process";
import { initTransactionController } from "./controllers/transactionController";
import formbody from "@fastify/formbody";

async function setup() {

    const ADDRESS = env.ADDRESS ?? "localhost";
    const PORT = env.PORT ?? "3000";

    const server = Fastify({logger: true});

    server.register(formbody);
    
    const SSEManager = await initializeSSEManager();

    // serves html file
    server.get("/", function (request,reply) {
        const htmlPath = path.join(__dirname,"../public/index.html");
        const htmlContent = readFileSync(htmlPath,"utf-8");
        reply.type("text/html").send(htmlContent);
    });
    
    await initCryptoEndpoints(SSEManager,server,db);
    await initTransactionController(SSEManager,server,db);

    modifyPrices(db);

    server.listen({ host: ADDRESS, port: Number(PORT) }, (err,address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
    });
}

setup();
