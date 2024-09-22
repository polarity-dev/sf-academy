"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fs_1 = __importDefault(require("fs"));
const server = (0, fastify_1.default)({ logger: true });
void (async () => {
    server.get('/ping', async (request, reply) => {
        return 'pong\n';
    });
    server.get('/', async (request, reply) => {
        const stream = fs_1.default.readFileSync("ui/index.html");
        reply.type('text/html').send(stream);
    });
    server.listen({ port: 4000, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
})().catch(console.error);
