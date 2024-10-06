import { Client } from 'pg'
import { Crypto } from '../entity/crypto';
import { User } from '../entity/user';
import { Status, Transaction, TransactionType } from '../entity/transaction';
import { Wallet } from '../entity/wallet';

export class DbManager {
    private client : Client

    constructor(){
        this.client = new Client({
            user: 'root',
            host: '127.0.0.1',
            database: 'cryptoMarket', 
            password: 'password123',
            port: 5432
        })

        this.client.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
    }

    getTransactionHistory(userId : string){
        const query =  `SELECT t.*, c.name as cryptoName FROM transactionHistory t
        inner join crypto c on c.id = t.cryptoId
        where userId = $1 order by transactiondate DESC`
        
        return this.client.query(query, [userId])
    }

    getTransactionQueue(userId : string){
        const query =  `SELECT t.*, c.name as cryptoName FROM TransactionQueue t
        inner join crypto c on c.id = t.cryptoId
        where userId = $1 order by transactiondate DESC`
        
        return this.client.query(query, [userId])
    }

    getTransactionToProcess(userId : string){
        const query =  `SELECT t.*, c.name as cryptoName FROM TransactionQueue t
        inner join crypto c on c.id = t.cryptoId
        where userId = $1 and status = 'pending' order by transactiondate DESC LIMIT 5`
        
        return this.client.query(query, [userId])
    }

    getTransactionToArchive(userId : string){
        const query =  `SELECT t.*, c.name as cryptoName FROM TransactionQueue t
        inner join crypto c on c.id = t.cryptoId
        where userId = $1 and status != 'pending' order by transactiondate DESC`
        
        return this.client.query(query, [userId])
    }

    async deleteProcessedTranscation(userId : string){
        const query =  `DELETE FROM TransactionQueue t 
        where userId = $1 and status != 'pending'`
        
        await this.client.query(query, [userId])
    }

    getCryptoList(){
        const query =  `SELECT * FROM crypto ORDER BY price DESC`
        
        return this.client.query(query) 
    }

    getUserWallet(userId : string){
        const query =  `SELECT w.*, c.name as cryptoName FROM Wallet w
        inner join crypto c on c.id = w.cryptoId
        where userId = $1 and w.quantity > 0 order by quantity`
        
        return this.client.query(query, [userId])
    }

    updateUserWallet(wallet : Wallet){
        const query =  `UPDATE Wallet SET userid = $1, cryptoid = $2, quantity = $3
        WHERE id = $4`
        const values = [wallet.userId, wallet.cryptoId, wallet.quantity,wallet.id]
        return this.client.query(query, values)
    }

    async insertUserWallet(userId : string, cryptoId : string, quantity : number){
        const query =  `INSERT INTO Wallet (userid, cryptoid, quantity)
        VALUES ($1, $2, $3)`
        const values = [userId, cryptoId, quantity]
        await this.client.query(query, values)
    }

    getCrypto(id : string){
        const query =  `SELECT * FROM crypto WHERE id = $1`
        return this.client.query(query, [id]) 
    }

    async putTransactionInQueue(user : User, crypto : Crypto, quantity : number, type : TransactionType){
        const query =  `INSERT INTO TransactionQueue (userid, cryptoid, price, quantity, type, status, transactionDate)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`
        const values = [user.id, crypto.id, crypto.price, quantity, type, Status.pending, new Date()]
        await this.client.query(query, values)
    }

    async archiveTransaction(t : Transaction){
        const query =  `INSERT INTO TransactionHistory (userid, cryptoid, price, quantity, type, status, transactionDate)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`
        const values = [t.userId, t.cryptoId, t.price, t.quantity, t.type, t.status, t.date]
        await this.client.query(query, values)
    }

    async updateTransactionQueue(transaction : Transaction){
        const query = `UPDATE transactionQueue SET userid = $1, cryptoid = $2, price = $3, quantity = $4, type = $5, status = $6, transactionDate = $7 WHERE id = $8`;
        const values = [transaction.userId, transaction.cryptoId, transaction.price, transaction.quantity, transaction.type, transaction.status, transaction.date, transaction.id]
        await this.client.query(query, values)
    }


    async updateCrypto(crypto : Crypto){
        const query = `UPDATE crypto SET name = $1, price = $2, quantity = $3 WHERE id = $4`;
        const values = [crypto.name, crypto.price, crypto.quantity, crypto.id]
        await this.client.query(query, values)
        
    }

    async updateCryptoQuantity(crypto : Crypto){
        const query = `UPDATE crypto SET quantity = $1 WHERE id = $2`;
        const values = [crypto.quantity, crypto.id]
        await this.client.query(query, values)
        
    }

    async initCrypto(){
        const n = Number(process.env.CRYPTO_NUMBER) || 5
        const maxValue = Number(process.env.CRYPTO_MAX_BASE_VALUE || 10000)
        const maxQta = Number(process.env.CRYPTO_MAX_BASE_QTA || 10000)
        const minQta = Number(process.env.CRYPTO_MIN_BASE_QTA || 100)
        const name = 'crypto'
        const query = `INSERT INTO crypto (name, price, quantity) VALUES ($1, $2, $3)`

        for(let i = 0; i < n; i++){
            const values = [name+i, Math.random() * maxValue,  Math.random() * (maxQta - minQta) + minQta]
            await this.client.query(query, values)
        }
        
    }

    async resetCrypto(){

        const query = `DELETE FROM crypto `
        await this.client.query(query)

        
    }

    async clearWallet(){

        const query = `DELETE FROM wallet `
        await this.client.query(query)

        
    }

}