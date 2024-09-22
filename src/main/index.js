"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fs_1 = __importDefault(require("fs"));
const sse_manager_1 = require("@soluzioni-futura/sse-manager");
const dbManager_1 = require("./manager/dbManager");
const dotenv_1 = __importDefault(require("dotenv"));
const server = (0, fastify_1.default)({ logger: true });
void (async () => {
    dotenv_1.default.config({ path: "../resources/.env" });
    const n = process.env.CRYPTO_NUMBER;
    console.log('aaaa', n);
    console.log(process.env);
    //init Crypto Data
    const dbManager = new dbManager_1.DbManager();
    dbManager.resetCrypto();
    let cryptoList = await dbManager.getCryptoList();
    console.log(cryptoList.rowCount);
    if (!cryptoList.rowCount || cryptoList.rowCount <= 0) {
        console.log("im here");
        dbManager.initCrypto();
    }
    //SSE manager
    const sseManager = await (0, sse_manager_1.createSSEManager)({
        httpAdapter: new sse_manager_1.FastifyHttpAdapter()
    });
    const room = "crypto-list";
    setInterval(async () => {
        await sseManager.broadcast(room, { data: cryptoList.rows.toString() });
    }, 10000);
    //HTML api
    server.get('/', async (request, reply) => {
        const stream = fs_1.default.readFileSync("ui/index.html");
        reply.type('text/html').send(stream);
    });
    server.get("/crypto-list", async (req, res) => {
        const sseStream = await sseManager.createSSEStream(res);
        cryptoList = await dbManager.getCryptoList();
        console.log(cryptoList);
        sseStream.broadcast({ data: cryptoList.rows.toString() });
        await sseStream.addToRoom(room);
        console.log("Successfully joined sseStream");
    });
    server.get("/queue", async (req, res) => {
        return "queue";
    });
    server.get("/transactions", async (req, res) => {
        return "transactions";
    });
    //Json api
    const baseJsonPath = '/api';
    server.get(baseJsonPath + '/crypto', async (request, reply) => {
        return 'pong\n';
    });
    server.get(baseJsonPath + '/transactions', async (request, reply) => {
        return 'pong\n';
    });
    server.post(baseJsonPath + '/transactions', async (request, reply) => {
        return 'pong\n';
    });
    server.listen({ port: 4000, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
})().catch(console.error);
