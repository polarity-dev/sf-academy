import { Client } from "pg";
import { env } from "process";

const db = new Client({
    host: env['DB_HOST'],
    user: env['DB_USER'],
    password: env['DB_PASSWORD'],
});

db.connect((err) => {
    if (err) console.log("Failed to connect to the database");
    else console.log("Connected to the database");
});

export default db;