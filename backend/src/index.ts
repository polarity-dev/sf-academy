import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";

const { ADDRESS = 'localhost', PORT = '3000' } = process.env;

const server = Fastify({logger: true});

server.listen({ host: ADDRESS, port: parseInt(PORT, 10) }, (err,address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    console.log("listening");
});