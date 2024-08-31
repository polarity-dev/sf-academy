import { Client } from "pg";

export async function dbQuery(db: Client, query: string, parametrized: Array<any> = []) {
    try {
        const response = (await db.query(query,parametrized)).rows;
        return response;
    } catch (err) {
        console.log(`Error during query ${query}:`, err);
        process.exit(1);
    }
}