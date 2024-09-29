import fastify from 'fastify'
import { createSSEManager, FastifyHttpAdapter } from '@soluzioni-futura/sse-manager'
import { DbManager } from './manager/dbManager'
import  dotenv  from 'dotenv';
import { Crypto } from './entity/crypto';
import { HtmlManager } from './ui/htmlManager';    
import { CryptoManager } from './manager/cryptoManager';
import { User } from './entity/user';
import { Transaction, TransactionType } from './entity/transaction';


const server = fastify({ logger: true })
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
    let user = new User({
        id : '1',
        name : "paolo",
        balance : process.env.STARTING_BALANCE || 100000
    })


    //SSE manager
    const sseManager = await createSSEManager({
        httpAdapter: new FastifyHttpAdapter()
    })

    const cryptoRoom = "crypto-room"
    const balanceRoom = "balance-room"

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


    //HTML api
    server.get('/', async (request, reply) => {
        const result  = await dbManager.getCryptoList();
        const cryptoList = result.rows.map( r => new Crypto(r))
        const resultT  = await dbManager.getTransactionQueue(user.id);
        const transactionList = resultT.rows.map( r => new Transaction(r))
        console.log(transactionList)
        reply.type('text/html').send(htmlManager.getMainpage(cryptoList, user, transactionList))
    })


    server.get('/ping', async (request, reply) => {
        return 'pong'
    })

    server.get("/crypto-list", async(req, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        const result  = await dbManager.getCryptoList();
        const cryptoList = result.rows.map( r => new Crypto(r))
        sseStream.broadcast({ data: htmlManager.getCryptoTable(cryptoList)})
        await sseStream.addToRoom(cryptoRoom)
        console.log("Successfully joined cryptoRoom")
    })

    server.get("/balance", async(req, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        sseStream.broadcast({ data: user.balance.toString() })
        await sseStream.addToRoom(balanceRoom)
        console.log("Successfully joined balanceRoom")
    })   

    server.post("/sell", async(req, res) => {
        let data : {crypto : string, quantity : number} = req.body as {crypto : string, quantity : number}
        let crypto = new Crypto(dbManager.getCrypto(data.crypto))
        dbManager.putTransactionInQueue(user, crypto, data.quantity, TransactionType.sell)
        return 'Vendi'
    })

    server.post("/buy",async(req, res) => {
        let data = req.body as {crypto : string, quantity : number}
        console.log(data.crypto)
        let crypto = new Crypto((await dbManager.getCrypto(data.crypto)).rows[0])
        console.log(crypto)
        dbManager.putTransactionInQueue(user, crypto, data.quantity, TransactionType.buy)
        return 'Compra'
    })



    //Json api
    const baseJsonPath = '/api'

    server.get(baseJsonPath+'/crypto', async (request, reply) => {
    
        return 'pong\n'
    })

    server.get(baseJsonPath+'/transactions', async (request, reply) => {
    
        return 'pong\n'
    })

    server.post(baseJsonPath+'/transactions', async (request, reply) => {
    
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

