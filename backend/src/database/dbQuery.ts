import { Client } from "pg";

export async function query(db: Client, query: string) {
    try {
        const response = (await db.query(query)).rows;
        return response;
    } catch (err) {
        console.log(`Error during query ${query}:`, err);
        process.exit(1);
    }
}