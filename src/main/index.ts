import fastify from 'fastify'
import fs from 'fs'
import { createSSEManager, FastifyHttpAdapter } from '@soluzioni-futura/sse-manager'
import { DbManager } from './manager/dbManager'
import  dotenv  from 'dotenv';
import { Crypto } from './entity/crypto';
import { HtmlManager } from './manager/htmlManager';    
import { CryptoManager } from './manager/cryptoManager';
import { User } from './entity/user';

const server = fastify({ logger: true })


void (async () => {

    dotenv.config({path : "../resources/.env"})

    const htmlManager = new HtmlManager()
    const cryptoManager = new CryptoManager()

    //init Crypto Data
    const dbManager = new DbManager()
    dbManager.resetCrypto()
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
        await sseManager.broadcast(cryptoRoom, { data: htmlManager.rowsToTable(updatedCrypto) })
    }, 10000)

    async function sendNewBalance(){
        await sseManager.broadcast(balanceRoom, { data: user.balance.toString() })
    }


    //HTML api
    server.get('/', async (request, reply) => {
        const stream = fs.readFileSync("ui/index.html")
        reply.type('text/html').send(stream)
        
    })


    server.get('/ping', async (request, reply) => {
        return 'pong'
    })

    server.get("/crypto-list", async(req, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        const result  = await dbManager.getCryptoList();
        const cryptoList = result.rows.map( r => new Crypto(r))
        console.log(cryptoList)
        sseStream.broadcast({ data: htmlManager.rowsToTable(cryptoList)})
        await sseStream.addToRoom(cryptoRoom)
        console.log("Successfully joined cryptoRoom")
    })

    server.get("/balance", async(req, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        sseStream.broadcast({ data: user.balance.toString() })
        await sseStream.addToRoom(balanceRoom)
        console.log("Successfully joined balanceRoom")
    })

    server.get("/queue", async(req, res) => {
        return "queue"
    })

    server.get("/transactions", async(req, res) => {
        return "transactions"
    })

    server.post("/sell", async(req, res) => {
        return "transactions"
    })


    server.post("/buy", async(req, res) => {
        return "transactions"
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

