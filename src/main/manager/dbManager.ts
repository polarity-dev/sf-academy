import { Client } from 'pg'
import { Crypto } from '../entity/crypto';

export class DbManager {
    private client : Client

    constructor(){
        this.client = new Client({
            user: 'root',
            host: 'db',
            database: 'cryptoMarket',
            password: 'password123',
            port: 5432
        })

        this.client.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
    }

    getTransactionHistory(){
        
    }

    getCryptoList(){
        const query =  "SELECT * FROM crypto"
        
        return this.client.query(query) 
    }

    buyCrypto(){

    }

    sellCrypto(){
        
    }

    getTransactionQueue(){

    }

    async updateCrypto(crypto : Crypto){
        const query = "UPDATE crypto SET name = $1, price = $2, quantity = $3 WHERE id = $4";
        const values = [crypto.name, crypto.price, crypto.quantity, crypto.id]
        await this.client.query(query, values)
        
    }

    async initCrypto(){
        const n = process.env.CRYPTO_NUMBER || 5
        const maxValue = Number(process.env.CRYPTO_MAX_BASE_VALUE || 10000)
        const maxQta = Number(process.env.CRYPTO_MAX_BASE_QTA || 10000)
        const minQta = Number(process.env.CRYPTO_MIN_BASE_QTA || 100)
        let name = 'crypto'
        const query = "INSERT INTO crypto (name, price, quantity) VALUES ($1, $2, $3)"

        for(let i = 0; i < 5; i++){
            const values = [name+i, Math.random() * maxValue,  Math.random() * (maxQta - minQta) + minQta]
            console.log(values)
            await this.client.query(query, values)
        }
        
    }

    async resetCrypto(){

        const query = "DELETE FROM crypto "
        await this.client.query(query)

        
    }

}