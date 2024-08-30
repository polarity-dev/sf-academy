import { createSSEManager, FastifyHttpAdapter } from "@soluzioni-futura/sse-manager";

export async function initializeSSEManager() {
    const SSEManager = await createSSEManager({
        httpAdapter: new FastifyHttpAdapter()
    });
    return SSEManager;
}