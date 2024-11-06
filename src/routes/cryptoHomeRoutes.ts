import { FastifyInstance, FastifyReply, FastifyRequest  } from 'fastify';
import { User, Crypto, TransactionQueue, CryptoParams } from '../models';

export async function HomeRoutes(server: FastifyInstance) {

//ENDPOINT HTML 
server.get('/my-saldo', async (request, reply) => {
    const username = 'admin';
  
    try {
      const client = await server.pg.connect();  // Connessione al DB 

      // Trova l'utente dal database
      const user = await client.query<User>('SELECT saldo FROM users WHERE username = $1', [username]);
      client.release();  // Rilascia il client
  
      if (user.rowCount === 0) {
        return reply.status(404).send({ message: 'Utente non trovato' });
      }
  
      let saldo = user.rows[0].saldo;
      
      let SaldoHTML = `<div class="">Saldo personale: ${saldo} € </div>`;
      // // Restituisci l'HTML come risposta
      return reply.type('text/html').send(SaldoHTML);
      //return reply.type('text/html').send('<p>Questo è un test HTML.</p>');
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Database query failed' });
    }
  });
  
  //ENDPOINT HTML che popola la tabella delle crypto
  server.get('/cryptos', async (request, reply) => {
      
    try {
        const client = await server.pg.connect();  // Connessione al DB 

        const { rows } = await client.query<Crypto>('SELECT name, symbol, price FROM crypto');  // Query 
        client.release();  // Rilascia il client
    
        //console.log(rows); 
    
        // Se non ci sono criptovalute, restituisci un messaggio vuoto
        if (rows.length === 0) {
          return reply.type('text/html').send('<p>Nessuna criptovaluta disponibile.</p>');
        }
    
        
        // Creiamo una tabella HTML con i dati delle criptovalute
        let cryptoTableHTML = `
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="bg-gray-200">
                <th class="px-4 py-2">Nome</th>
                <th class="px-4 py-2">Simbolo</th>
                <th class="px-4 py-2">Prezzo (in euro)</th>
                <th class="px-4 py-2"></th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
        `;
    
        // Iteriamo sui risultati per generare le righe della tabella
        rows.forEach(crypto => {
          const price = crypto.price;
          const formattedPrice = isNaN(price) ? '0.00' : price;
    
          cryptoTableHTML += `
            <tr>
              <td class="border px-4 py-2">${crypto.name}</td>
              <td class="border px-4 py-2">${crypto.symbol}</td>
              <td id="crypto-price-${crypto.symbol}" class="border px-4 py-2 ">${formattedPrice} €</td>
              <td style="text-align: center" class="border whitespace-nowrap px-4 py-2">
                <button hx-get="/buy/${crypto.symbol}" hx-target="#popup-form" class="bg-green-500 text-white px-4 py-2 rounded">Buy</button>
              </td>
              <td style="text-align: center" class="border whitespace-nowrap px-4 py-2">
                <button hx-get="/sell/${crypto.symbol}" hx-target="#popup-form" class="bg-red-500 text-white px-4 py-2 rounded">Sell</button>
              </td>
            </tr>
          `;
        });
    
        cryptoTableHTML += `
            </tbody>
            </table>
        `;
        console.log(cryptoTableHTML);
    
        return reply.type('text/html').send(cryptoTableHTML);
      } catch (err) {
        server.log.error(err);
        return reply.status(500).send({ error: 'Database query failed' });
      }
    });
  
  // Endpoint html per caricare la lista delle transazioni
  server.get('/my-transactions', async (request, reply) => {
  
    try {
      const client = await server.pg.connect();  // Connessione al DB
      const userId = 1;
  
      // Ottieni le transazioni con una join sulla tabella crypto per ottenere il simbolo e lo stato
      const transactions = await client.query<TransactionQueue & { symbol: string }>(`
        SELECT tq.id, tq.transaction_type, tq.crypto_amount, tq.transaction_final_value, tq.status, c.symbol
        FROM transaction_queue tq
        JOIN crypto c ON tq.crypto_id = c.id
        WHERE tq.user_id = $1
        ORDER BY tq.created_at DESC
      `, [userId]);
  
      console.log("Transazioni: ", transactions.rows.length)
  
      // Controlla se ci sono transazioni
      let transactionTableRows;
      if (transactions.rows.length === 0) {
        // Se non ci sono transazioni, mostra un messaggio
        transactionTableRows = ``;
      } else {
        // Genera le righe della tabella con il simbolo della criptovaluta e lo stato
        transactionTableRows = transactions.rows.map(transaction => `
          <tr>
            <td class="border px-4 py-2">${transaction.transaction_type === 'buy' ? 'Acquisto' : 'Vendita'}</td>
            <td class="border px-4 py-2">${transaction.symbol}</td>
            <td class="border px-4 py-2">${transaction.crypto_amount} ${transaction.symbol}</td>
            <td class="border px-4 py-2">${transaction.transaction_final_value} EUR</td>
            <td id="transaction-${transaction.id}" class="border px-4 py-2">${transaction.status}</td>
          </tr>
        `).join('');
      }
  
      // Genera la tabella delle transazioni
      const transactionTable = `
        <table id="transactions-table" class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gray-200">
              <th class="px-4 py-2">Azione</th>
              <th class="px-4 py-2">Simbolo</th>
              <th class="px-4 py-2">Quantità</th>
              <th class="px-4 py-2">Valore</th>
              <th class="px-4 py-2">Stato</th>
            </tr>
          </thead>
          <tbody id="transaction-body">
            ${transactionTableRows}
          </tbody>
        </table>
      `;
      client.release(); 
  
      return reply.type('text/html').send(transactionTable);
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Database query failed' });
    }
  });

  server.get<{ Params: CryptoParams }>('/buy/:symbol', async (request: FastifyRequest<{ Params: CryptoParams }>, reply: FastifyReply) => {
    const cryptosymbol = request.params.symbol;
    try {
      const client = await server.pg.connect();  // Connessione al DB 

      const crypto = await client.query<Crypto>('SELECT * FROM crypto WHERE symbol = $1', [cryptosymbol]);
  
      const formHtml = `
        <form hx-post="/api/transactions"  hx-push-url="false" hx-trigger="submit" hx-target="#popup-form">
          <h2>Compra ${crypto.rows[0].name} (${crypto.rows[0].symbol})</h2>
          <input type="hidden" name="cryptoId" value="${crypto.rows[0].id}">
          <input type="hidden" name="transactionType" value="buy">
          <label for="quantity">Quantità:</label>
          <input type="number" id="quantity" name="quantity" min="0.01" step="0.01" required>
          <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded" >Conferma Acquisto</button>
        </form>
      `;
  
    return reply.type('text/html').send(formHtml);
  
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Database query failed' });
    }
  });

  server.get<{ Params: CryptoParams }>('/sell/:symbol', async (request: FastifyRequest<{ Params: CryptoParams }>, reply: FastifyReply) => {
    const cryptosymbol = request.params.symbol;
  
    try {
      const client = await server.pg.connect();  // Connessione al DB 
      const crypto = await client.query('SELECT * FROM crypto WHERE symbol = $1', [cryptosymbol]);
  
      const formHtml = `
        <form hx-post="/api/transactions"  hx-push-url="false" hx-trigger="submit" hx-target="#popup-form">
          <h2>Vendi ${crypto.rows[0].name} (${crypto.rows[0].symbol})</h2>
          <input type="hidden" name="cryptoId" value="${crypto.rows[0].id}">
          <input type="hidden" name="transactionType" value="sell">
          <label for="quantity">Quantità:</label>
          <input type="number" id="quantity" name="quantity" min="0.01" step="0.01" required>
          <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded">Conferma Vendita</button>
        </form>
      `;
  
      return reply.type('text/html').send(formHtml);
  
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Database query failed' });
    }
  });
  
}
