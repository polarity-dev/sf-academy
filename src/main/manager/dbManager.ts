import { Client } from 'pg'

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
        
    }

    buyCrypto(){

    }

    sellCrypto(){
        
    }

    getTransactionQueue(){

    }

    initCrypto(){
        
        
    }

}