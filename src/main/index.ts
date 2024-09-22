import fastify from 'fastify'
import fs from 'fs'
import { createSSEManager, FastifyHttpAdapter } from '@soluzioni-futura/sse-manager'
import { DbManager } from './manager/dbManager'
import  dotenv  from 'dotenv';
import { Crypto } from './entity/crypto';
import { HtmlManager } from './manager/htmlManager';

const server = fastify({ logger: true })


void (async () => {

    dotenv.config({path : "../resources/.env"})

    const htmlManager = new HtmlManager()

    //init Crypto Data
    const dbManager = new DbManager()
    const cryptoList = await dbManager.getCryptoList();
    if(!cryptoList.rowCount || cryptoList.rowCount <= 0){
        dbManager.initCrypto()
    }


    //SSE manager
    const sseManager = await createSSEManager({
        httpAdapter: new FastifyHttpAdapter()
    })

    const room = "crypto-list"

    setInterval(async() => {
        const result  = await dbManager.getCryptoList();
        const cryptoList = result.rows.map( r => new Crypto(r))
        await sseManager.broadcast(room, { data: htmlManager.rowsToTable(cryptoList) })
    }, 60000)


    //HTML api
    server.get('/', async (request, reply) => {
        const stream = fs.readFileSync("ui/index.html")
        reply.type('text/html').send(stream)
        
    })

    server.get("/crypto-list", async(req, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        const result  = await dbManager.getCryptoList();
        const cryptoList = result.rows.map( r => new Crypto(r))
        console.log(cryptoList)
        sseStream.broadcast({ data: htmlManager.rowsToTable(cryptoList)})
        await sseStream.addToRoom(room)
        console.log("Successfully joined sseStream")
    })

    server.get("/queue", async(req, res) => {
        return "queue"
    })

    server.get("/transactions", async(req, res) => {
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

