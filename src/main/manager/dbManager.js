"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbManager = void 0;
const pg_1 = require("pg");
class DbManager {
    constructor() {
        this.client = new pg_1.Client({
            user: 'root',
            host: 'db',
            database: 'cryptoMarket',
            password: 'password123',
            port: 5432
        });
        this.client.connect(function (err) {
            if (err)
                throw err;
            console.log("Connected!");
        });
    }
    getTransactionHistory() {
    }
    getCryptoList() {
        const query = "SELECT * FROM crypto";
        return this.client.query(query);
    }
    buyCrypto() {
    }
    sellCrypto() {
    }
    getTransactionQueue() {
    }
    async initCrypto() {
        console.log("here too");
        const n = process.env.CRYPTO_NUMBER;
        const maxValue = Number(process.env.CRYPTO_MAX_BASE_VALUE);
        const maxQta = Number(process.env.CRYPTO_MAX_BASE_QTA);
        const minQta = Number(process.env.CRYPTO_MIN_BASE_QTA);
        let name = 'crypto';
        console.log("then here too", n, maxValue);
        const query = "INSERT INTO crypto (name, price, quantity) VALUES ($1, $2, $3)";
        for (let i = 0; i < 5; i++) {
            console.log("here");
            const values = [name + i, Math.random() * maxValue, Math.random() * (maxQta - minQta) + minQta];
            console.log(values);
            await this.client.query(query, values);
        }
    }
    async resetCrypto() {
        const query = "DELETE FROM crypto ";
        await this.client.query(query);
    }
}
exports.DbManager = DbManager;
