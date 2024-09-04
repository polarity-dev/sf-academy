import { createSSEManager, FastifyHttpAdapter } from "@soluzioni-futura/sse-manager";

// crea un SSE Manager con un FastifyAdapter
export async function initializeSSEManager() {
    const SSEManager = await createSSEManager({
        httpAdapter: new FastifyHttpAdapter()
    });
    return SSEManager;
}