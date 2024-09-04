import { FastifyRequest, FastifyReply } from "fastify";
import { SSEManager } from '@soluzioni-futura/sse-manager';

// Gestisce le nuove connessioni SSE cosi' come la loro chiusura
export async function handleNewConnection(SSEManager: SSEManager, request: FastifyRequest, reply: FastifyReply, room: string) {
    const SSEStream = await SSEManager.createSSEStream(reply);

    const controller = new AbortController();
    const signal = controller.signal;

    request.raw.on("close", async function() {
        await SSEStream.removeFromRoom(room); 
        controller.abort();
    });

    await SSEStream.addToRoom(room);

    return signal;
};