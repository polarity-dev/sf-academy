import express from "express";
import { Request, Response } from "express";
import { env } from "process";
import multer from "multer";
import { tmpdir } from "os";
import Worker from "./worker";
import FileData from "./models/FileData";
import db from "./db";
const app = express();
const port = env.PORT ?? 8080;

const upload = multer({ dest: tmpdir(), limits: { fileSize: 2 ** 20 } });
const worker = new Worker();

app.use(express.urlencoded({ extended: true }));
app.use(express.query({}));

/*
    POST /importDataFromFile: permette di caricare un file da processare come indicato di seguito
*/

app.post("/importDataFromFile", upload.single("upload"), (req, res) => {
    if (!req.file) res.sendStatus(400);
    else {
        const lineRegex = RegExp("^(\\d) (.*)\n$");
        const parseFile = (data: string) => {
            const rows: FileData[] = data.split('\n').map((line): FileData => {
                const [match, priority, message] = line.trimEnd().match(lineRegex);
                if (!priority || !message) throw Error("Malformed file");
                return { priority, message };
            });
            return rows;
        }

        const data = req.file.buffer.toString('utf-8');
        try {
            const rows = parseFile(data);
            worker.enqueueNewData(rows);
            res.sendStatus(204);
        }
        catch (err: any) {
            console.error("Failed to parse input file:", err);
            res.sendStatus(400);
        }

    }
});

// GET /pendingData: restituisce in formato JSON la lista dei dati non ancora processati
app.get("/pendingData", (req, res) => {
    res.json(worker.getQueue());
});

interface DataEndpointQueryParams {
    from?: number;
    limit?: number;
}

/*
GET /data: restituisce in formato JSON la lista dei dati già processati, ordinati secondo il timestamp di elaborazione. In query string potranno essere passati 2 parametri
    from: se presente si dovranno restituire i dati elaborati da questo valore (inteso come timestamp) in poi
    limit: se presente dovrà essere limitato a questo valore il numero di messaggi restituiti
*/
app.get("/data", (req: Request<{}, {}, {}, DataEndpointQueryParams>, res) => {
    const params: any[] = [];
    let { from, limit } = req.query;
    let query = "SELECT * FROM DATA ";
    if (from) {
        query += "WHERE timestamp > $1 ";
        params.push(from);
    }
    query += "ORDER BY timestamp DESC ";

    if (limit) {
        query += `LIMIT ${params.length + 1}`;
        params.push(limit);
    }

    db.query(query, params, (error, result) => {
        if (error) {
            console.error("Error when trying to fetch processed data:", error);
            res.sendStatus(500);
        }
        else res.json(result.rows);

    });
});

app.listen(port, () => {
    console.log("Server started");
});
