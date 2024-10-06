"use strict";
// src/seed.ts
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
async function seedDatabase() {
    const client = new pg_1.Client({
        connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/cryptodb',
    });
    await client.connect();
    const cryptocurrencies = [
        { name: 'Bitcoin', symbol: 'BTC' },
        { name: 'Ethereum', symbol: 'ETH' },
        { name: 'Ripple', symbol: 'XRP' },
        // Aggiungi altre criptovalute se necessario
    ];
    for (const crypto of cryptocurrencies) {
        const price = Math.random() * (10000 - 1) + 1;
        await client.query('INSERT INTO cryptocurrencies (name, symbol, price) VALUES ($1, $2, $3) ON CONFLICT (symbol) DO NOTHING', [crypto.name, crypto.symbol, price]);
    }
    await client.end();
}
seedDatabase().catch((err) => {
    console.error('Errore durante il seeding del database:', err);
});
