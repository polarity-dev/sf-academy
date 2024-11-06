import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import { cryptoRoutes } from './routes/cryptoRoutes';
import { HomeRoutes } from './routes/cryptoHomeRoutes';
import fastifyCookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import fastifyPostgres from '@fastify/postgres';  // Import corretto
import fastifyFormbody from '@fastify/formbody';
// import { createSSEManager, FastifyHttpAdapter } from '@soluzioni-futura/sse-manager';

declare module 'fastify' {
  interface FastifyInstance {
      authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

// Inizializza SseManager
// const sseManager = createSSEManager({
//   httpAdapter: new FastifyHttpAdapter() // default
// });

const server = Fastify({ logger: true });

//server.register(fastifyCookie);

// Registrazione del plugin per gestire i form urlencoded
server.register(fastifyFormbody);

// Servire i file statici dalla cartella "public"
server.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/public/',
});

// Connessione al database PostgreSQL
server.register(fastifyPostgres, {
  //connectionString: 'postgres://postgres:dabochair@localhost/Crypto_App'
  connectionString: process.env.DB_CONNECTION_STRING

});

// Registra le route di autenticazione
server.register(cryptoRoutes);
server.register(HomeRoutes);

server.get('/', async (request, reply) => {
  return reply.type('text/html').sendFile('index.html', path.join(__dirname, '../public'));
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0'});
    console.log(`Server running at http://localhost:3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();