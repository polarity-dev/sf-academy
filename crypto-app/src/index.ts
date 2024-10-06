// index.ts
import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import path from 'path';
import fastifyStatic from '@fastify/static';
import fastifyFormBody from '@fastify/formbody';
import { createSSEManager, FastifyHttpAdapter, SSEManager } from '@soluzioni-futura/sse-manager';

// Importa le rotte API
import apiRoutes from './routes/api';
import htmlRoutes from './routes/htmlRoutes';

const server = Fastify({ logger: true });

server.register(fastifyFormBody);

// Configurazione del database
server.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL,
});

// Servire file statici
server.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/public/',
  index: false, // Evita conflitti con la rotta "/"
});

// Dichiara sseManager al di fuori per renderlo accessibile
let sseManager: SSEManager;

// Funzione per aggiornare i prezzi delle criptovalute
const updateCryptoPrices = async () => {
  if (!sseManager) {
    server.log.error('sseManager non è stato inizializzato.');
    return;
  }

  const client = await server.pg.connect();
  try {
    // Aggiorna i prezzi delle criptovalute nel database con variazioni casuali
    await client.query(`
      UPDATE cryptocurrencies
      SET price = price * (1 + (random() * 0.1 - 0.05)) -- variazione tra -5% e +5%
    `);

    // Recupera le criptovalute aggiornate
    const { rows } = await client.query('SELECT name, symbol, price FROM cryptocurrencies');

    // Converti price in numero
    const cryptocurrencies = rows.map(row => ({
      name: row.name,
      symbol: row.symbol,
      price: Number(row.price) // Conversione qui
    }));

    // Invia i dati aggiornati ai client connessi tramite SSE
    await sseManager.broadcast('crypto-room', { data: JSON.stringify(cryptocurrencies) });
    server.log.info('Dati broadcasted tramite SSE.');
  } catch (err) {
    server.log.error('Errore durante l\'aggiornamento dei prezzi:', err);
  } finally {
    client.release();
  }
};

// Avvio del server
const start = async () => {
  try {
    // Inizializza sseManager con FastifyHttpAdapter passando l'istanza di Fastify
    sseManager = await createSSEManager({
      httpAdapter: new FastifyHttpAdapter(),
    });
    server.log.info('sseManager inizializzato correttamente.');

    // Rotta per gli eventi SSE
    server.get('/events', async (request, reply) => {
      server.log.info('Ricevuta richiesta SSE.');

      try {
        // Imposta gli header SSE
        reply.raw.setHeader('Content-Type', 'text/event-stream');
        reply.raw.setHeader('Cache-Control', 'no-cache');
        reply.raw.setHeader('Connection', 'keep-alive');

        // Crea lo stream SSE
        const sseStream = await sseManager.createSSEStream(reply);
        sseStream.addToRoom('crypto-room');
        server.log.info('Nuovo client SSE connesso alla room "crypto-room".');
      } catch (err) {
        server.log.error('Errore nella creazione dello stream SSE:', err);
        reply.status(500).send('Internal Server Error');
      }
    });

    // Rotta per la pagina principale
    server.get('/', async (request, reply) => {
      return reply.type('text/html').sendFile('index.html', path.join(__dirname, 'views'));
    });

    // Registra le rotte API
    server.register(apiRoutes);
    server.register(htmlRoutes);

    // Avvia il server
    await server.listen({ port: 3000, host: '0.0.0.0' });
    server.log.info(`Server in esecuzione su http://localhost:3000`);

    // Esegui un aggiornamento iniziale dei prezzi
    await updateCryptoPrices();

    // Imposta un intervallo per aggiornare i prezzi ogni minuto
    setInterval(updateCryptoPrices, 60000);
  } catch (err: any) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
