import * as express from 'express';
import * as multer from "multer";
import * as fs from 'fs';
import * as util from 'util';

import * as cache from "./cache";
import * as database from "./database";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

const deleteFile = util.promisify(fs.unlink);

router.post("/importDataFromFile", upload.single("file"), (req, res) => {
    console.log("importDataFromFile");

    const file = req.file;

    if (!file) {
        res.status(400).send("File non inviato");
        return;
    }

    if (!file.path) {
        res.status(400).send("Path del file non disponibile");
        return;
    }

    // l'idea qui è che alla ricezione del file dalla post, vengano filtrate le linee con priorità compresa tra A e B, e poi vengano smistate nelle rispettive code.
    // salvare prima il file sul disco e poi leggerlo crea dell'overhead imbarazzante, ma non ho trovato un modo migliore per leggere il contenuto del file.
    // si potrebbe migliorare con un buffer, e l'utilizzo di qualche altra libreria come express-fileupload, ma non ho avuto tempo per approfondire.

    fs.readFile(file.path, "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("Errore durante la lettura del file");
            return;
        }

        const lines = data.split("\n");

        let A = 0; let B = 0; let p = 0; let K = 0;

        for (let i = 0; i < lines.length; i++) {
            if (i === 0) {
                lines[0].split(" ").forEach((value, index) => {
                    if (index === 0) {
                        A = parseInt(value);
                    } else if (index === 1) {
                        B = parseInt(value);
                    }
                });
            }
            else {
                if (i - 1 >= A && i - 1 < B) {
                    let arr = lines[i].split(" ");
                    p = parseInt(arr.splice(0, 1)[0] || "0");
                    K = parseInt(arr.splice(0, 1)[0] || "0");

                    cache.default.push(p - 1, [K, arr.join(" ")]);
                }
            }
        }


        res.status(200).send("File importato correttamente");

        // cancella il file
        deleteFile(file.path).then(() => {
            console.log("File cancellato");
        }).catch((err) => {
            console.log("Errore durante la cancellazione del file");
        });
    });
});

router.get("/pendingData", (req, res) => {
    res.send({ result: cache.default.getAll() });
    res.end();
});

router.get("/data", (req, res) => {

    let FROM = req.query.from;
    let LIMIT = req.query.limit;

    if (FROM === undefined)
        FROM = "0";
    if (LIMIT === undefined)
        LIMIT = "" + Date.now();

    let con = database.default.getConnection();
    if (con != null) {
        con.query("SELECT K,D FROM  mytb WHERE (T >= " + FROM + "  AND T < " + LIMIT + ")  ORDER BY `T` DESC", (error, results, fields) => {
            if (error)
                console.log(error);

            res.send({result :results});
            res.end();
        });
    }
});

export default router;