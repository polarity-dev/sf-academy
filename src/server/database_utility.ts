import * as mysql from "mysql2";

export async function connect(): Promise<mysql.Connection | null> {
    try {
        return await new Promise<mysql.Connection>((resolve, reject) => {
            const connection = mysql.createConnection({
                host: "db",
                user: "root",
                password: "password",
                database: "mydb",
            });
            connection.connect((error) => {
                if (error) {
                    reject(error);
                } else {
                    console.log("connesso a mysql@db");
                    resolve(connection);
                }
            });
        });
    } catch (error) {
        try {
            return await new Promise<mysql.Connection>((resolve, reject) => {
                const connection = mysql.createConnection({
                    host: "127.0.0.1",
                    user: "root",
                    password: "password",
                    database: "mydb",
                });

                connection.connect((error) => {
                    if (error) {
                        reject(error);
                    } else {
                        console.log("connesso a mysql@127.0.0.1");
                        resolve(connection);
                    }
                });
            });
        } catch (error) {
        }
    }
    return null;
}