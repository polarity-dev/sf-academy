//oggetto singleton

import * as mysql from "mysql2";
import * as database_utility from "./database_utility";

class Database {
    private static instance: Database;
    private connection: mysql.Connection | null;

    constructor() {
        this.connection = null;
    }

    async connect(): Promise<mysql.Connection | null> {
        try {
            this.connection = await database_utility.connect();
        } catch (error) {
            console.log(error);
        }  
        return this.connection;
    }

    public getConnection(): mysql.Connection | null {
        return this.connection;
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

export default Database.getInstance();