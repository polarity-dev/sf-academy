import { SSEManager } from "@soluzioni-futura/sse-manager";

// manda dati a una relativa room
export async function broadcastData(SSEManager: SSEManager,room: string,data: string) {
    SSEManager.broadcast(room, {data: data});
};