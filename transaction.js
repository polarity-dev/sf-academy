#!/usr/bin/env node
const { Command } = require('commander');
const fastify = require('fastify')();

// Configura PostgreSQL (puoi adattare i parametri di connessione)
fastify.register(require('fastify-postgres'), {
  connectionString: process.env.DB_CONNECTION_STRING
});

const program = new Command();

// Funzione per avviare Fastify e assicurarsi che il plugin sia pronto
async function startFastify() {
  try {
    await fastify.ready(); // Aspetta che Fastify carichi tutti i plugin
    console.log('Fastify è pronto e PostgreSQL è connesso');
  } catch (err) {
    console.error('Errore durante l\'avvio di Fastify:', err);
    process.exit(1);
  }
}

// Definisci il comando
program
  .argument('<crypto>', 'Sigla della criptovaluta')
  .argument('<action>', 'Azione (buy/sell)')
  .option('-q, --quantity <number>', 'Quantità', '1')
  .action(async (cryptoSymbol, action, options) => {
    await startFastify(); // Avvia Fastify e verifica che sia pronto

    const quantity = parseFloat(options.quantity); // Parsing della quantità

    // Verifica se l'azione è valida
    if (!['buy', 'sell'].includes(action)) {
      console.error('Azione non valida. Usa "buy" o "sell".');
      process.exit(1);
    }

    try {
      const client = await fastify.pg.connect(); // Connessione a PostgreSQL
      const crypto = await client.query('SELECT id, price FROM crypto WHERE symbol = $1', [cryptoSymbol]);

      if (crypto.rowCount === 0) {
        console.error('Criptovaluta non trovata.');
        process.exit(1);
      }

      let success = false;

      const cryptoId = crypto.rows[0].id;
      const cryptoPrice = parseFloat(crypto.rows[0].price);
      const transactionValue = parseFloat((cryptoPrice * quantity).toFixed(2));

      // Supponendo che l'utente sia definito (modifica se necessario)
      const userId = 1; // ID dell'utente fittizio, da personalizzare
      let saldo = (await client.query('SELECT saldo FROM users WHERE id = $1', [userId])).rows[0].saldo;

      // Inserisci la transazione nel database
      let result = await client.query(
        `INSERT INTO transaction_queue (user_id, crypto_id, crypto_amount, transaction_type, price_at_transaction, transaction_final_value)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [userId, cryptoId, quantity, action, cryptoPrice, transactionValue]
      );

      // Acquisto
      if (action === 'buy') {
        if (saldo < transactionValue) {
          await client.query('UPDATE transaction_queue SET status = $1 WHERE id = $2', ['failed', result.rows[0].id]);
          console.error('Saldo insufficiente per completare la transazione.');
          process.exit(1);
        }
        saldo -= transactionValue;
      }

      // Vendita
      if (action === 'sell') {
        const cryptoHoldings = await client.query(
          'SELECT SUM(crypto_amount) AS total_crypto FROM transaction_queue WHERE user_id = $1 AND crypto_id = $2 AND transaction_type = \'buy\' AND status = \'completed\'',
          [userId, cryptoId]
        );

        const totalCryptoOwned = cryptoHoldings.rows[0].total_crypto || 0;
        if (totalCryptoOwned < quantity) {
          await client.query('UPDATE transaction_queue SET status = $1 WHERE id = $2', ['failed', result.rows[0].id]);
          console.error('Quantità di criptovaluta insufficiente per la vendita.');
          process.exit(1);
        }
        saldo += transactionValue;
      }

      // Aggiorna il saldo
      await client.query('UPDATE users SET saldo = $1 WHERE id = $2', [saldo, userId]);
      await client.query('UPDATE transaction_queue SET status = $1 WHERE id = $2', ['completed', result.rows[0].id]);

      console.log(`Transazione di ${action} completata con successo per ${quantity} ${cryptoSymbol}. Valore: ${transactionValue} EUR`);
      console.log(`Saldo aggiornato a ${saldo}`);

      client.release();
    } catch (error) {
      console.error('Errore nella transazione:', error);
      process.exit(1);
    }
  });

// Avvia il programma
program.parse(process.argv);
