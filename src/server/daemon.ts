import * as mysql from 'mysql2';
import * as cache from "./cache";
import * as database from "./database";

export async function start(con: mysql.Connection | null, timeout = 10 * 1000) {

    let max = 15;

    async function task() {
        console.log("task run", Date.now());
        let n = 0;
        let i = 4;
        let elem = undefined;
        let con = database.default.getConnection();
        let time = Date.now();

        if (con === null) {
            console.log("connessione al database non disponibile");
            return;
        }

        while (n < max && i >= 0) {
            elem = cache.default.pop(i);

            if (elem !== undefined) {
                n++;

                console.log("inserisco in mytb", i, elem);

                con.query("INSERT INTO mytb (T,K,D) VALUES (?)", [[time].concat(elem)], (error, results, fields) => {
                    if (error)
                        console.log(error);
                });
            }
            else {
                i--;
            }
        }



    }

    setInterval(task, timeout);
}
