import fastify from 'fastify'
import fs from 'fs'
import { createSSEManager, FastifyHttpAdapter } from '@soluzioni-futura/sse-manager'

const server = fastify({ logger: true })


void (async () => {

    server.get('/ping', async (request, reply) => {
    
        return 'pong\n'
    })
    server.get('/', async (request, reply) => {
        const stream = fs.readFileSync("ui/index.html")
        reply.type('text/html').send(stream)
        
    })

    server.listen({ port: 4000, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(`Server listening at ${address}`)
    })

    
})().catch(console.error)

