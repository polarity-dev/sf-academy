import express from "express";
import { Request, Response } from "express";
import { env } from "process";
import multer from "multer";
import { tmpdir } from "os";
import Worker from "./worker";
import FileData from "./models/FileData";
import db from "./db";
import fs from "fs";

const app = express();
const port = env.API_PORT ?? 8080;

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 ** 20 } });
const worker = new Worker();

app.use(express.urlencoded({ extended: true }));
app.use(express.query({}));

// POST /importDataFromFile: permette di caricare un file da processare come indicato di seguito
app.post("/importDataFromFile", upload.single("upload"), (req, res) => {
    if (!req.file) res.sendStatus(400);
    else {
        const lineRegex = RegExp("^(\\d) (.*)$");
        const parseFile = (data: string) => {
            const rows: FileData[] = data.split('\n').map((line): FileData => {
                let matches = line.trimEnd().match(lineRegex);
                if (!matches) throw Error("Malformed file 1");
                const priority = matches[1];
                const message = matches[2]
                if (!priority || !message) throw Error("Malformed file");

                return { priority: Number(priority), message };
            });
            return rows;
        }

        const data = req.file.buffer.toString('utf-8').trimEnd();
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
    let query = "SELECT timestamp, message FROM DATA ";
    if (from) {
        try {
            let fromParam = new Date(Number(from));
            query += "WHERE timestamp >= $1 ";
            params.push(fromParam);
        } catch { console.error("Failed to parse from parameter:", from) }
    }
    query += "ORDER BY timestamp DESC ";

    if (limit) {
        try {
            query += `LIMIT $${params.length + 1}`;
            params.push(limit);
        } catch { console.error("Failed to parse limit parameter:", limit); }
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