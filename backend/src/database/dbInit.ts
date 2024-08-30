import { Client } from "pg";

const db = new Client({
    user: 'myuser',
    host: 'db',
    database: 'mydatabase',
    password: 'mypassword',
    port: 5432
});

db.connect((err) => {
    if (err) {
        console.log("Error connecting to the database:",err);
        process.exit(1);
    } else {
        console.log("Connected successfully to the database");
    }
});

export default db;