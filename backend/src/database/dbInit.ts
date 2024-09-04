import { Client } from "pg";
import { env } from "process";

const db = new Client({
    user: env.user ?? 'myuser',
    host: env.host ?? 'db',
    database: env.database ?? 'mydatabase',
    password: env.password ?? 'mypassword',
    port: (env.port ? Number(env.port) : 5432)
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:",err);
        process.exit(1);
    } else {
        console.log("Connected successfully to the database");
    }
});

export default db;