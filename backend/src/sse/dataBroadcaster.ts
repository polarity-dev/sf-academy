import { SSEManager } from "@soluzioni-futura/sse-manager";

export async function broadcastData(SSEManager: SSEManager,room: string,data: string) {
    SSEManager.broadcast(room, {data: data});
};