// src/routes/api.ts

import { FastifyInstance } from 'fastify';

export default async function apiRoutes(server: FastifyInstance) {
  // Rotta GET /api/crypto
  server.get('/api/crypto', async (request, reply) => {
    const client = await server.pg.connect();
    try {
      const { rows } = await client.query('SELECT * FROM cryptocurrencies');
      return reply.send(rows);
    } catch (err: any) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Errore nel recupero delle criptovalute' });
    } finally {
      client.release();
    }
  });
  // Rotta GET /api/transactions
  server.get('/api/transactions', async (request, reply) => {
    const client = await server.pg.connect();
    try {
      const { rows } = await client.query(`
        SELECT 
          t.id, 
          c.symbol AS crypto_symbol, 
          t.action, 
          t.amount, 
          t.price_at_transaction, 
          t.status, 
          t.timestamp
        FROM transactions t
        JOIN cryptocurrencies c ON t.crypto_id = c.id
        ORDER BY t.timestamp DESC
      `);
      return reply.send(rows);
    } catch (err: any) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Errore nel recupero delle transazioni' });
    } finally {
      client.release();
    }
  });
  // Rotta POST /api/transactions
  server.post('/api/transactions', async (request, reply) => {
    const client = await server.pg.connect();
    try {
      const { crypto, action, quantity } = request.body as any;

      // Validazione dei dati in ingresso
      if (!crypto || !action || !quantity || quantity <= 0) {
        return reply.status(400).send({ error: 'Dati mancanti o non validi' });
      }

      await client.query('BEGIN');

      // Recupera l'ID e il prezzo della criptovaluta
      const cryptoResult = await client.query(
        'SELECT id, price FROM cryptocurrencies WHERE symbol = $1',
        [crypto.toUpperCase()]
      );
      if (cryptoResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return reply.status(400).send({ error: 'Criptovaluta non trovata' });
      }
      const cryptoId = cryptoResult.rows[0].id;
      const priceAtTransaction = Number(cryptoResult.rows[0].price);

      // Recupera l'utente e il suo saldo (FOR UPDATE per evitare race condition)
      const userResult = await client.query(
        'SELECT balance_euro FROM users WHERE id = 1 FOR UPDATE'
      );
      if (userResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return reply.status(400).send({ error: 'Utente non trovato' });
      }
      let balanceEuro = Number(userResult.rows[0].balance_euro);

      let transactionStatus = 'completed'; // Default status

      if (action.toLowerCase() === 'buy') {
        const totalCost = priceAtTransaction * quantity;
        
        server.log.info("Qui")
        if (balanceEuro < totalCost) {
          // Saldo insufficiente
          
          transactionStatus = 'failed';
        } else {
          // Aggiorna il saldo dell'utente
          balanceEuro -= totalCost;
          await client.query(
            'UPDATE users SET balance_euro = $1 WHERE id = 1',
            [balanceEuro]
          );

          // Aggiorna il portafoglio dell'utente
          const portfolioResult = await client.query(
            `
            SELECT amount FROM user_portfolio 
            WHERE user_id = 1 AND crypto_id = $1
            `,
            [cryptoId]
          );

          if (portfolioResult.rows.length > 0) {
            // Criptovaluta già presente nel portafoglio, aggiorna la quantità
            const newAmount = Number(portfolioResult.rows[0].amount) + Number(quantity);
            await client.query(
              `
              UPDATE user_portfolio SET amount = $1 
              WHERE user_id = 1 AND crypto_id = $2
              `,
              [newAmount, cryptoId]
            );
          } else {
            // Criptovaluta non presente nel portafoglio, inserisci una nuova riga
            await client.query(
              `
              INSERT INTO user_portfolio (user_id, crypto_id, amount) 
              VALUES ($1, $2, $3)
              `,
              [1, cryptoId, quantity]
            );
          }
        }

      } else if (action.toLowerCase() === 'sell') {
        // Recupera la quantità di criptovaluta posseduta dall'utente
        const portfolioResult = await client.query(
          `
          SELECT amount FROM user_portfolio 
          WHERE user_id = 1 AND crypto_id = $1
          `,
          [cryptoId]
        );

        if (portfolioResult.rows.length === 0 || Number(portfolioResult.rows[0].amount) < quantity) {
          // Criptovaluta insufficiente
          transactionStatus = 'failed';
        } else {
          // Calcola il ricavo dalla vendita
          const totalRevenue = priceAtTransaction * quantity;
          balanceEuro += totalRevenue;
          await client.query(
            'UPDATE users SET balance_euro = $1 WHERE id = 1',
            [balanceEuro]
          );

          // Aggiorna il portafoglio dell'utente
          const newAmount = Number(portfolioResult.rows[0].amount) - Number(quantity);
          if (newAmount > 0) {
            await client.query(
              `
              UPDATE user_portfolio SET amount = $1 
              WHERE user_id = 1 AND crypto_id = $2
              `,
              [newAmount, cryptoId]
            );
          } else {
            // Se la quantità diventa zero, rimuovi la riga dal portafoglio
            await client.query(
              `
              DELETE FROM user_portfolio 
              WHERE user_id = 1 AND crypto_id = $1
              `,
              [cryptoId]
            );
          }
        }

      } else {
        await client.query('ROLLBACK');
        return reply.status(400).send({ error: 'Azione non valida' });
      }
      server.log.info(`Transaction Status: ${transactionStatus}`);
      // Inserisci la transazione (sia 'completed' che 'failed')
      await client.query(
        `
        INSERT INTO transactions (crypto_id, action, amount, price_at_transaction, status)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [cryptoId, action.toLowerCase(), quantity, priceAtTransaction, transactionStatus]
      );

      await client.query('COMMIT');

      if (transactionStatus === 'failed') {
        return reply.send({ message: 'Transazione fallita'});
      }

      return reply.send({ message: 'Transazione eseguita con successo' });

    } catch (err: any) {
      await client.query('ROLLBACK');
      server.log.error(err);
      return reply.status(500).send({ error: 'Errore nell\'esecuzione della transazione' });
    } finally {
      client.release();
    }
  });
}
