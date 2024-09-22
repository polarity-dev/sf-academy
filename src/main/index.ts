import fastify from 'fastify'
import fs from 'fs'
import { createSSEManager, FastifyHttpAdapter } from '@soluzioni-futura/sse-manager'

const server = fastify({ logger: true })


void (async () => {

    //SSE manager
    const sseManager = await createSSEManager({
        httpAdapter: new FastifyHttpAdapter()
    })

    const room = "crypto-list"

    setInterval(async() => {
        await sseManager.broadcast(room, { data: "8  080" })
    }, 10000)


    //HTML api
    server.get('/', async (request, reply) => {
        const stream = fs.readFileSync("ui/index.html")
        reply.type('text/html').send(stream)
        
    })

    server.get("/crypto-list", async(req, res) => {
        const sseStream = await sseManager.createSSEStream(res)
        sseStream.broadcast({ data: "Joining you to test-room" })
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

