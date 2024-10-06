import { FastifyInstance } from 'fastify';

export default async function htmlRoutes(server: FastifyInstance) {
  server.get('/balance', async (request, reply) => {
    const client = await server.pg.connect();
    try {
      server.log.info('Connessione al database stabilita per /balance');
      const { rows } = await client.query('SELECT balance_euro FROM users WHERE id = 1');
      if (!rows || rows.length === 0) {
        server.log.error('Utente non trovato nella tabella users');
        return reply.type('text/html').status(404).send('<p>Saldo non disponibile</p>');
      }
      // Cast esplicito a number
      const balance = Number(rows[0].balance_euro) || 0; // Usa 0 se il valore è null o undefined
      return reply.type('text/html').send(`<p>Saldo: €${balance.toFixed(2)}</p>`);
    } catch (err) {
      server.log.error('Errore durante l\'esecuzione della query su /balance:', err);
      return reply.status(500).send('Errore interno del server');
    } finally {
      client.release();
    }
  });
  server.get('/portfolio', async (request, reply) => {
    const client = await server.pg.connect();
    try {
      server.log.info('Connessione al database stabilita per /portfolio');
      const { rows } = await client.query(`
        SELECT c.symbol, c.name, up.amount, c.price
        FROM user_portfolio up
        JOIN cryptocurrencies c ON up.crypto_id = c.id
        WHERE up.user_id = 1
      `);
      if (!rows || rows.length === 0) {
        server.log.error('Nessuna criptovaluta trovata nel portafoglio utente');
        return reply.type('text/html').send('<p>Nessuna criptovaluta posseduta.</p>');
      }

      // Costruisce la tabella HTML
      let html = `<table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">Criptovaluta</th>
            <th class="py-2 px-4 border-b">Nome</th>
            <th class="py-2 px-4 border-b">Quantità</th>
            <th class="py-2 px-4 border-b">Prezzo Attuale (€)</th>
            <th class="py-2 px-4 border-b">Valore Totale (€)</th>
          </tr>
        </thead>
        <tbody>`;

      rows.forEach(item => {
        // Cast esplicito dei valori numerici
        const amount = Number(item.amount) || 0;
        const price = Number(item.price) || 0;
        const totalValue = amount * price;
        
        html += `
          <tr class="hover:bg-gray-100">
            <td class="py-2 px-4 border-b">${item.symbol}</td>
            <td class="py-2 px-4 border-b">${item.name}</td>
            <td class="py-2 px-4 border-b">${amount}</td>
            <td class="py-2 px-4 border-b">${price.toFixed(2)}</td>
            <td class="py-2 px-4 border-b">${totalValue.toFixed(2)}</td>
          </tr>
        `;
      });

      html += `</tbody></table>`;
      return reply.type('text/html').send(html);
    } catch (err) {
      server.log.error('Errore durante l\'esecuzione della query su /portfolio:', err);
      return reply.status(500).send('Errore interno del server');
    } finally {
      client.release();
    }
  });
  server.get('/crypto', async (request, reply) => {
    const client = await server.pg.connect();
    try {
      server.log.info('Connessione al database stabilita per /crypto-list');
      const { rows } = await client.query('SELECT * FROM cryptocurrencies');
      if (!rows || rows.length === 0) {
        server.log.error('Nessuna criptovaluta trovata nella tabella cryptocurrencies');
        return reply.type('text/html').status(404).send('<p>Nessuna criptovaluta disponibile</p>');
      }

      let html = `<table class="min-w-full bg-white">
        <thead><tr><th>Nome</th><th>Simbolo</th><th>Prezzo (€)</th></tr></thead>
        <tbody>`;
      rows.forEach(crypto => {
        // Cast esplicito a number
        const price = Number(crypto.price) || 0; // Usa 0 se il valore è null o undefined
        html += `<tr><td>${crypto.name}</td><td>${crypto.symbol}</td><td>${price.toFixed(2)}</td></tr>`;
      });
      html += `</tbody></table>`;
      return reply.type('text/html').send(html);
    } catch (err) {
      server.log.error('Errore durante l\'esecuzione della query su /crypto-list:', err);
      return reply.status(500).send('Errore interno del server');
    } finally {
      client.release();
    }
  });
  server.get('/crypto-options', async (request, reply) => {
    const client = await server.pg.connect();
    try {
      const { rows } = await client.query('SELECT name, symbol FROM cryptocurrencies ORDER BY name');
      if (!rows || rows.length === 0) {
        return reply.type('text/html').send('<option value="">Nessuna criptovaluta disponibile</option>');
      }
  
      // Costruisce le opzioni HTML
      let html = '';
      rows.forEach(crypto => {
        html += `<option value="${crypto.symbol}">${crypto.name} (${crypto.symbol})</option>`;
      });
      return reply.type('text/html').send(html);
    } catch (err) {
      server.log.error('Errore durante l\'esecuzione della query su /crypto-options:', err);
      return reply.status(500).send('Errore interno del server');
    } finally {
      client.release();
    }
  });
  server.get('/transactions', async (request, reply) => {
    const client = await server.pg.connect();
    try {
      server.log.info('Connessione al database stabilita per /transactions-list');
      const { rows } = await client.query(`
        SELECT t.id, c.symbol, t.action, t.amount, t.price_at_transaction, t.status, t.timestamp
        FROM transactions t
        JOIN cryptocurrencies c ON t.crypto_id = c.id
        ORDER BY t.timestamp DESC
      `);
  
      // Se nessuna transazione è presente, restituisci un messaggio di "nessuna transazione"
      let html = `<table class="min-w-full bg-white">
        <thead><tr><th>ID</th><th>Criptovaluta</th><th>Azione</th><th>Quantità</th><th>Prezzo (€)</th><th>Stato</th><th>Timestamp</th></tr></thead>
        <tbody>`;
  
      if (!rows || rows.length === 0) {
        server.log.info('Nessuna transazione trovata nella tabella transactions');
        html += `<tr><td colspan="7" class="py-4 px-4 text-center">Nessuna transazione trovata</td></tr>`;
      } else {
        // Genera le righe per ciascuna transazione
        rows.forEach(tx => {
          // Cast esplicito a number per i campi numerici
          const price = Number(tx.price_at_transaction) || 0;
          const amount = Number(tx.amount) || 0;
          html += `<tr><td>${tx.id}</td><td>${tx.symbol}</td><td>${tx.action}</td><td>${amount}</td><td>${price.toFixed(2)}</td><td>${tx.status}</td><td>${new Date(tx.timestamp).toLocaleString()}</td></tr>`;
        });
      }
  
      html += `</tbody></table>`;
      return reply.type('text/html').send(html);
    } catch (err) {
      server.log.error('Errore durante l\'esecuzione della query su /transactions-list:', err);
      return reply.status(500).send('Errore interno del server');
    } finally {
      client.release();
    }
  });
  // Rotta POST /transactions per HTMX
  server.post('/transactions', async (request, reply) => {
    const client = await server.pg.connect();
    try {
      const { crypto, action, quantity } = request.body as any;
  
      // Validazione dei dati in ingresso
      if (!crypto || !action || !quantity || quantity <= 0) {
        return reply.type('text/html').status(400).send('<p class="text-red-500">Dati mancanti o non validi.</p>');
      }
  
      await client.query('BEGIN');
  
      // Recupera l'ID e il prezzo della criptovaluta
      const cryptoResult = await client.query(
        'SELECT id, price FROM cryptocurrencies WHERE symbol = $1',
        [crypto.toUpperCase()]
      );
      if (cryptoResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return reply.type('text/html').status(404).send('<p class="text-red-500">Criptovaluta non trovata.</p>');
      }
      const cryptoId = cryptoResult.rows[0].id;
      const priceAtTransaction = Number(cryptoResult.rows[0].price);
  
      // Recupera l'utente e il suo saldo (FOR UPDATE per evitare race condition)
      const userResult = await client.query(
        'SELECT balance_euro FROM users WHERE id = 1 FOR UPDATE'
      );
      if (userResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return reply.type('text/html').status(404).send('<p class="text-red-500">Utente non trovato.</p>');
      }
      let balanceEuro = Number(userResult.rows[0].balance_euro);
  
      let transactionStatus = 'completed'; // Default status
  
      if (action.toLowerCase() === 'buy') {
        const totalCost = priceAtTransaction * quantity;
  
        if (balanceEuro < totalCost) {
          // Saldo insufficiente
          transactionStatus = 'failed';
        } else {
          // Aggiorna il saldo dell'utente
          balanceEuro -= totalCost;
          await client.query('UPDATE users SET balance_euro = $1 WHERE id = 1', [balanceEuro]);
  
          // Aggiorna il portafoglio dell'utente
          const portfolioResult = await client.query(
            'SELECT amount FROM user_portfolio WHERE user_id = 1 AND crypto_id = $1',
            [cryptoId]
          );
  
          if (portfolioResult.rows.length > 0) {
            // Criptovaluta già presente nel portafoglio, aggiorna la quantità
            const newAmount = Number(portfolioResult.rows[0].amount) + Number(quantity);
            await client.query(
              'UPDATE user_portfolio SET amount = $1 WHERE user_id = 1 AND crypto_id = $2',
              [newAmount, cryptoId]
            );
          } else {
            // Criptovaluta non presente nel portafoglio, inserisci una nuova riga
            await client.query(
              'INSERT INTO user_portfolio (user_id, crypto_id, amount) VALUES ($1, $2, $3)',
              [1, cryptoId, quantity]
            );
          }
        }
      } else if (action.toLowerCase() === 'sell') {
        // Recupera la quantità di criptovaluta posseduta dall'utente
        const portfolioResult = await client.query(
          'SELECT amount FROM user_portfolio WHERE user_id = 1 AND crypto_id = $1',
          [cryptoId]
        );
  
        if (portfolioResult.rows.length === 0 || Number(portfolioResult.rows[0].amount) < quantity) {
          // Criptovaluta insufficiente
          transactionStatus = 'failed';
        } else {
          // Calcola il ricavo dalla vendita
          const totalRevenue = priceAtTransaction * quantity;
          balanceEuro += totalRevenue;
          await client.query('UPDATE users SET balance_euro = $1 WHERE id = 1', [balanceEuro]);
  
          // Aggiorna il portafoglio dell'utente
          const newAmount = Number(portfolioResult.rows[0].amount) - Number(quantity);
          if (newAmount > 0) {
            await client.query(
              'UPDATE user_portfolio SET amount = $1 WHERE user_id = 1 AND crypto_id = $2',
              [newAmount, cryptoId]
            );
          } else {
            // Se la quantità diventa zero, rimuovi la riga dal portafoglio
            await client.query('DELETE FROM user_portfolio WHERE user_id = 1 AND crypto_id = $1', [cryptoId]);
          }
        }
      } else {
        await client.query('ROLLBACK');
        return reply.type('text/html').status(400).send('<p class="text-red-500">Azione non valida.</p>');
      }
  
      // Inserisci la transazione (sia 'completed' che 'failed')
      await client.query(
        'INSERT INTO transactions (crypto_id, action, amount, price_at_transaction, status) VALUES ($1, $2, $3, $4, $5)',
        [cryptoId, action.toLowerCase(), quantity, priceAtTransaction, transactionStatus]
      );
  
      await client.query('COMMIT');
  
      
  
      // Invia l'header HX-Trigger per attivare l'evento transaction-completed
      reply.header('HX-Trigger', 'transaction-completed');
  
      // Invia il messaggio di conferma della transazione con il nuovo saldo e stato
      if (transactionStatus === 'failed') {
        return reply.type('text/html').send('<p class="text-red-500">Transazione fallita: saldo o quantità insufficiente.</p>');
      }
      return reply.type('text/html').send(`
        <p class="text-green-500">Transazione eseguita con successo!</p>
        <p>Nuovo saldo: €${balanceEuro.toFixed(2)}</p>
      `);
    } catch (err: any) {
      await client.query('ROLLBACK');
      server.log.error(err);
      return reply.type('text/html').status(500).send('<p class="text-red-500">Errore durante l\'esecuzione della transazione.</p>');
    } finally {
      client.release();
    }
  });
}
