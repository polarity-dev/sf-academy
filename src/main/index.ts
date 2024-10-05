import fastify from 'fastify'
import { createSSEManager, FastifyHttpAdapter } from '@soluzioni-futura/sse-manager'
import { DbManager } from './manager/dbManager'
import  dotenv  from 'dotenv';
import { Crypto } from './entity/crypto';
import { HtmlManager } from './ui/htmlManager';    
import { CryptoManager } from './manager/cryptoManager';
import { User } from './entity/user';
import { Status, Transaction, TransactionType } from './entity/transaction';
import { Wallet } from './entity/wallet';


const server = fastify({ logger: true })
// eslint-disable-next-line @typescript-eslint/no-require-imports
server.register(require('@fastify/formbody'))


void (async () => {

    dotenv.config({path : "../resources/.env"})

    const htmlManager = new HtmlManager()
    const cryptoManager = new CryptoManager()

    //init Crypto Data
    const dbManager = new DbManager()
    const cryptoList = await dbManager.getCryptoList();
    if(!cryptoList.rowCount || cryptoList.rowCount <= 0){
        dbManager.initCrypto()
    }

    //init user
    const user = new User({
        id : '1',
        name : "paolo",
        balance : process.env.STARTING_BALANCE || 100000
    })

    setInterval(async() => {
        const result  = await dbManager.getTransactionToProcess(user.id)
        const transactionList = result.rows.map( r => new Transaction(r))
        const resultWallet  = await dbManager.getUserWallet(user.id)
        const wallet = resultWallet.rows.map( r => new Wallet(r))
        let type = 1
        for(const t of transactionList){
            type = t.type === 'buy'? -1 : 1 // -1 compro | 1 vendo
            if(type === 1){
                if(wallet.length === 0){
                    t.status = Status.failed
                } else {
                    const x = wallet.filter( (x : Wallet) => x.cryptoId === t.cryptoId)
                    if(x.length !== 0 && x[0].quantity >= t.quantity){
                        user.balance = Math.round((user.balance + (t.quantity * t.price)) * 100) / 100
                        t.status = Status.completed
                    } else {
                        t.status = Status.failed
                    }
                }
            } else {
                if(user.balance >= t.quantity * t.price){
                    const x = wallet.filter( (x : Wallet) => x.cryptoId === t.cryptoId)
                    if(x.length === 0){
                        user.balance = Math.round((user.balance - (t.quantity * t.price)) * 100) / 100
                    } else {
                        x[0].quantity += t.quantity
                    }
                    t.status = Status.completed
                } else {
                    t.status = Status.failed
                }
                
            }
            dbManager.updateTransactionQueue(t)
            sendNewBalance()
            sendUpdatedTransaction(transactionList)
        }
        //console.log(transactionList)
        

        
    }, 2000)


    //SSE manager
    const sseManager = await createSSEManager({
        httpAdapter: new FastifyHttpAdapter()
    })

    const cryptoRoom = "crypto-room"
    const balanceRoom = "balance-room"
    const transactionRoom = "transactionRoom"

    //broadcast dei nuovi valori
    setInterval(async() => {
        const result  = await dbManager.getCryptoList();
        const cryptoList = result.rows.map( r => new Crypto(r))
        const updatedCrypto = cryptoManager.changeMarketValue(cryptoList)
        await sendNewCryptoList(htmlManager.getCryptoTable(updatedCrypto))
    }, 1000000000)

    async function sendNewCryptoList(html : string){
        await sseManager.broadcast(cryptoRoom, { data: html })
    }

    async function sendNewBalance(){
        await sseManager.broadcast(balanceRoom, { data: user.balance.toString() })
    }

    async function sendUpdatedTransaction(transactionList : Transaction[]){
        await sseManager.broadcast(transactionRoom, { data: htmlManager.getTransactionTable(transactionList) })
    }


    //HTML api
    server.get('/', async (request, reply) => {
        const result  = await dbManager.getCryptoList();
        const cryptoList = result.rows.map( r => new Crypto(r))
        reply.type('text/html').send(htmlManager.getMainpage(cryptoList, user))
    })


    server.get("/crypto-list", async(req, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        const result  = await dbManager.getCryptoList();
        const cryptoList = result.rows.map( r => new Crypto(r))
        sseStream.broadcast({ data: htmlManager.getCryptoTable(cryptoList)})
        await sseStream.addToRoom(cryptoRoom)
        console.log("Successfully joined cryptoRoom")
    })

    server.get("/transaction-table", async(req, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        const resultT  = await dbManager.getTransactionQueue(user.id);
        const transactionList = resultT.rows.map( r => new Transaction(r))
        sseStream.broadcast({ data: htmlManager.getTransactionTable(transactionList)})
        await sseStream.addToRoom(transactionRoom)
        console.log("Successfully joined transactionRoom")
    })

    server.get("/balance", async(req, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        sseStream.broadcast({ data: user.balance.toString() })
        await sseStream.addToRoom(balanceRoom)
        console.log("Successfully joined balanceRoom")
    })   

    server.post("/sell", async(req) => {
        const data = req.body as {crypto : string, quantity : number}
        const crypto = new Crypto((await dbManager.getCrypto(data.crypto)).rows[0])
        dbManager.putTransactionInQueue(user, crypto, data.quantity, TransactionType.sell)
        const resultT  = await dbManager.getTransactionQueue(user.id);
        const transactionList = resultT.rows.map( r => new Transaction(r))
        return htmlManager.getTransactionTable(transactionList)
    })

    server.post("/buy",async(req) => {
        const data = req.body as {crypto : string, quantity : number}
        const crypto = new Crypto((await dbManager.getCrypto(data.crypto)).rows[0])
        dbManager.putTransactionInQueue(user, crypto, data.quantity, TransactionType.buy)
        const resultT  = await dbManager.getTransactionQueue(user.id);
        const transactionList = resultT.rows.map( r => new Transaction(r))
        return htmlManager.getTransactionTable(transactionList)
    })



    //Json api
    const baseJsonPath = '/api'

    server.get(baseJsonPath+'/crypto', async () => {
    
        return 'pong\n'
    })

    server.get(baseJsonPath+'/transactions', async () => {
    
        return 'pong\n'
    })

    server.post(baseJsonPath+'/transactions', async () => {
    
        return 'pong\n'
    })



    server.listen({ port: 4000, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(`Server listening at ${address}`)
    })

    
})().catch(console.error)

