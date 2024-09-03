import { Client } from "pg";

export async function dbQuery(db: Client,query: string,params: Array<any> = []) { // general purpose query
    try {
        const data = (await db.query(query,params)).rows;
        return { success : true, data : data };
    } catch (error) {
        console.error("Error while querying the database: ", query, params, error);
        return { success: false };
    }
}

export async function getTable(db: Client,tableName: string,order: string) { // get full table with given order
    return await dbQuery(db,`select * from ${tableName} order by ${order};`);
}