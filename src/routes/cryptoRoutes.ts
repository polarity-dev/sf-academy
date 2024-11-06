import { FastifyInstance, FastifyReply, FastifyRequest  } from 'fastify';
import { User, Crypto, TransactionQueue } from '../models';
import { createSSEManager, FastifyHttpAdapter } from '@soluzioni-futura/sse-manager';

// Inizializza SseManager
const sseManager = createSSEManager({
    httpAdapter: new FastifyHttpAdapter() // default
  });

export async function cryptoRoutes(server: FastifyInstance) {

    // Endpoint per la connessione al flusso SSE
    server.get('/update-prices', async (request, reply) => {
        const sseStream = await (await sseManager).createSSEStream(reply); 
        await sseStream.broadcast({ data: 'Connessione stabilita al flusso di prezzi' });
        await sseStream.addToRoom('crypto-prices');
    });
        // Endpoint per la connessione al flusso SSE
    server.get('/transaction-update', async (request, reply) => {
        const sseStream = await (await sseManager).createSSEStream(reply); 
        await sseStream.broadcast({ data: 'Aggiunta transazione tabella' });
        await sseStream.addToRoom('status-update');
    });
    
    // Endpoint per la connessione al flusso SSE
    server.get('/update-saldo', async (request, reply) => {
        const sseStream = await (await sseManager).createSSEStream(reply); 
        await sseStream.broadcast({ data: 'Aggiornamento del saldo' });
        await sseStream.addToRoom('saldo-update');
    });
    
    // Endpoint per la connessione al flusso SSE
    server.get('/update-tr-table', async (request, reply) => {
        const sseStream = await (await sseManager).createSSEStream(reply); 
        await sseStream.broadcast({ data: 'Nuova transazione in arrivo' });
        await sseStream.addToRoom('table-update');
    });



setInterval(async () => {
    try {
      console.log("Sono nel processing");
      const client = await server.pg.connect();
  
      // Seleziona le prime 5 transazioni in coda
      const { rows: transactions }: { rows: TransactionQueue[] } = await client.query(
        `SELECT * FROM transaction_queue WHERE status = 'pending' ORDER BY created_at LIMIT 5`
      );

      if (transactions.length === 0) return;
  
  
      for (const transaction of transactions) {
        const { id, user_id, crypto_id, crypto_amount, transaction_type, transaction_final_value } = transaction;
        
        let transaction_val = transaction_final_value;

        // Ottieni il saldo dell'utente
        let saldo = (await client.query<{ saldo: number }>('SELECT saldo FROM users WHERE id = $1', [user_id])).rows[0].saldo;

        if (typeof saldo !== 'number') {
          saldo = Number(saldo);
        }
        if (typeof transaction_val !== 'number') {
          transaction_val = Number(transaction_final_value);
        }

        let success = false;
        console.log(transaction_val);

        // Acquisto
        if (transaction_type === 'buy') {
          console.log("Acquisto")
          console.log(saldo)
          if (saldo >= transaction_val) {
            saldo -= transaction_val;
            console.log('Saldo post acquisto: ', saldo);
            success = true;
          }
        } else if (transaction_type === 'sell') {
          console.log("Vendita")
          console.log(saldo)
          const cryptoPossedute = await client.query(
            'SELECT SUM(crypto_amount) AS total_crypto FROM transaction_queue WHERE user_id = $1 AND crypto_id = $2 AND transaction_type = \'buy\' AND status = \'completed\'',
            [user_id, crypto_id]
          );
          const totalCryptoPossedute = parseFloat(cryptoPossedute.rows[0].total_crypto || 0);
  
          if (totalCryptoPossedute >= crypto_amount) {
            saldo += transaction_val;
            console.log('Saldo post vendita: ', saldo);
            success = true;
          }
        }
  
        const status = success ? 'completed' : 'failed';
        console.log("Aggiorno prezzo")
        if (success) {
          // Aggiorna il saldo
          await client.query('UPDATE users SET saldo = $1 WHERE id = $2', [saldo, user_id]);
          // Aggiorna lo stato della transazione a "completed"
          await client.query('UPDATE transaction_queue SET status = $1 WHERE id = $2', [status, id]);
          console.log("Aggiorato prezzo")
        } else {
          await client.query('UPDATE transaction_queue SET status = $1 WHERE id = $2', [status, id]);
          console.log("Aggiorato prezzo")
  
        }
  
         await (await sseManager).broadcast('status-update', {
          data: JSON.stringify({
            transactionId: transaction.id,
            status: status,
          })
        });
  
        await (await sseManager).broadcast('saldo-update', {
          data: JSON.stringify({
            newSaldo: saldo.toFixed(2),
          })
        });
      }
      client.release();
    } catch (error) {
      console.error('Errore', error);
    }
  }, 20000);
  
  // Aggiornamento automatico del prezzo della crypto
  setInterval(async () => {
    try {
      const client = await server.pg.connect(); // Connessione db
      const { rows: cryptos } = await client.query<Crypto>('SELECT id, symbol, price FROM crypto');
  
      for (const crypto of cryptos) {
        const randomFactor = (Math.random() * 0.1) - 0.05; // Variazione casuale fino al 5% (positivo o negativo)
        const newPrice = parseFloat((crypto.price * (1 + randomFactor)).toFixed(2));
        // console.log("Vecchio prezzo: ", crypto.price);
        // console.log("Nuovo prezzo: ", newPrice);
        // console.log("Variazione: ", randomFactor);
        // Aggiorna il prezzo nel database
        await client.query('UPDATE crypto SET price = $1, price_updated_at = NOW() WHERE id = $2', [newPrice, crypto.id]);
  
        // Invia il nuovo prezzo tramite SSE
        await (await sseManager).broadcast('crypto-prices', {
          data: JSON.stringify({
            id: crypto.id,
            symbol: crypto.symbol,
            newPrice: newPrice
          })
        });
      }
      client.release();
    } catch (err) {
      console.log('Errore', err);
    }
  }, 60000); // Aggiorna ogni 60 secondi
  

 //ENDPOINT JSON per restituzione crypto
  server.get('/api/crypto', async (request, reply) => {
    try {
        const client = await server.pg.connect(); 
        const { rows } = await client.query<Crypto>('SELECT * FROM crypto');  // Esegui la query
        client.release();  // Rilascia il client
    
        console.log(rows); 
        
        return reply.send(rows);  // Invia i risultati come risposta JSON
    } catch (err) {
        server.log.error(err);
        return reply.status(500).send({ error: 'Database query failed' });
    }
  });

    //ENDPOINT JSON  restituzione transazioni
  server.get('/api/transactions', async (request, reply) => {
      const username = 'admin';
      //console.log(username)
      const client = await server.pg.connect(); 
      try {
          const transactions = await client.query<TransactionQueue & { name: string; symbol: string }>(`
          SELECT c.name, c.symbol, t.transaction_type, t.crypto_amount, 
                      t.price_at_transaction, t.transaction_final_value, t.status, t.created_at
              FROM transaction_queue t
              JOIN crypto c ON t.crypto_id = c.id
              JOIN users u ON t.user_id = u.id
              WHERE u.username = $1
              ORDER BY t.created_at DESC;`, [username]);
          
          client.release();
          return reply.send(transactions.rows);
      } catch (error) {
          server.log.error(error);
          return reply.status(500).send({ error: 'Errore nella get delle transazioni' });
      }
  });

    // Endpoint HTml per acquistare o vendere criptovalute
    server.post('/api/transactions', async (request, reply) => {
      //Prendo i dati della crypto
      const { cryptoId, transactionType, quantity } = request.body as { cryptoId: number, transactionType: 'buy' | 'sell', quantity: number };
      const username = 'admin';

      try {
          const client = await server.pg.connect(); 
          // Trova l'utente dal database
          const user = await client.query<User>('SELECT id, saldo FROM users WHERE username = $1', [username]);
          
          if (user.rowCount === 0) {
          return reply.status(404).send({ message: 'Utente non trovato' });
          }

          const userId = user.rows[0].id;

          // Ottieni il prezzo attuale della cripto
          const crypto = await client.query<{ price: number }>('SELECT price FROM crypto WHERE id = $1', [cryptoId]);
          
          if (crypto.rowCount === 0) 
              return reply.status(404).send({ message: 'Criptovaluta non trovata' });
          
          const cryptoPrice = crypto.rows[0].price;

          // Calcola il valore totale della transazione prezzo * quantità acquistata/venduta
          const transactionValue = parseFloat((cryptoPrice * quantity).toFixed(2));

          console.log('Valore della transazione:', transactionValue);

          //transazione nel db in pending 
          const result = await client.query<TransactionQueue>(
          `INSERT INTO transaction_queue (user_id, crypto_id, crypto_amount, transaction_type, price_at_transaction, transaction_final_value, status)
          VALUES ($1, $2, $3, $4, $5, $6, 'pending')
          RETURNING id`,
          [userId, cryptoId, quantity, transactionType, cryptoPrice, transactionValue]
          );

          const id_tr = result.rows[0].id;

          const symbol = (await client.query<{ symbol: string }>('SELECT symbol FROM crypto WHERE id = $1', [cryptoId])).rows[0].symbol;

          //console.log(id_tr);
          await (await sseManager).broadcast('table-update', {
          data: JSON.stringify({
              id_tr: id_tr,
              cryptoId: cryptoId,
              symbol: symbol,
              quantity: quantity,
              transactionType: transactionType,
              transactionValue: transactionValue,
              status: 'pending'
          })
          });

          // Risposta al client, svuota il form
          return reply.type('text/html').send('<div id="form-container"><div class="alert alert-success" role="alert">Operazione effettuata, in attesa di elaborazione. </div></div>');

      } catch (error) {
          server.log.error(error);
          return reply.status(500).send({ error: 'Failed query' });
      }
    });


    // Endpoint Json per acquistare o vendere criptovalute
    server.post('/api/transaction', async (request, reply) => {
        //Prendo i dati della crypto
        const { cryptoId, transactionType, quantity } = request.body as { cryptoId: number, transactionType: 'buy' | 'sell', quantity: number };
        const username = 'admin';
  
        try {
            const client = await server.pg.connect(); 
            // Trova l'utente dal database
            const user = await client.query<User>('SELECT id, saldo FROM users WHERE username = $1', [username]);
            
            if (user.rowCount === 0) {
            return reply.status(404).send({ message: 'Utente non trovato' });
            }
  
            const userId = user.rows[0].id;
  
            // Ottieni il prezzo attuale della cripto
            const crypto = await client.query<{ price: number }>('SELECT price FROM crypto WHERE id = $1', [cryptoId]);
            
            if (crypto.rowCount === 0) 
                return reply.status(404).send({ message: 'Criptovaluta non trovata' });
            
            const cryptoPrice = crypto.rows[0].price;
  
            // Calcola il valore totale della transazione prezzo * quantità acquistata/venduta
            const transactionValue = parseFloat((cryptoPrice * quantity).toFixed(2));
  
            console.log('Valore della transazione:', transactionValue);
  
            //transazione nel db in pending 
            const result = await client.query<TransactionQueue>(
            `INSERT INTO transaction_queue (user_id, crypto_id, crypto_amount, transaction_type, price_at_transaction, transaction_final_value, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'pending')
            RETURNING id`,
            [userId, cryptoId, quantity, transactionType, cryptoPrice, transactionValue]
            );
  
            const id_tr = result.rows[0].id;
  
            const symbol = (await client.query<{ symbol: string }>('SELECT symbol FROM crypto WHERE id = $1', [cryptoId])).rows[0].symbol;
  
          
            const data = JSON.stringify({
                id_tr: id_tr,
                cryptoId: cryptoId,
                symbol: symbol,
                quantity: quantity,
                transactionType: transactionType,
                transactionValue: transactionValue,
                status: 'pending'
            })
  
            // Risposta al client, svuota il form
            return reply.send(data);
  
        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: 'Failed query' });
        }
      });
}
