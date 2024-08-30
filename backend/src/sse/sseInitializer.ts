import { createSSEManager, FastifyHttpAdapter } from "@soluzioni-futura/sse-manager";

// creates an SSE Manager with a Fastify adapter 
export async function initializeSSEManager() {
    const SSEManager = await createSSEManager({
        httpAdapter: new FastifyHttpAdapter()
    });
    return SSEManager;
}