import express from "express";
import { Request, Response } from "express";
import { env } from "process";
import multer from "multer";
import { tmpdir } from "os";

const app = express();
const port = env.PORT ?? 8080;

const upload = multer({ dest: tmpdir(), limits: { fileSize: 2 ** 20 } });

app.use(express.urlencoded({ extended: true }));
app.use(express.query({}));
app.use();
/*
    POST /importDataFromFile: permette di caricare un file da processare come indicato di seguito
    GET /pendingData: restituisce in formato JSON la lista dei dati non ancora processati
    GET /data: restituisce in formato JSON la lista dei dati già processati, ordinati secondo il timestamp di elaborazione. In query string potranno essere passati 2 parametri
        from: se presente si dovranno restituire i dati elaborati da questo valore (inteso come timestamp) in poi
        limit: se presente dovrà essere limitato a questo valore il numero di messaggi restituiti
    
    Il file da processare conterrà una o piú righe contenenti ognuna un numero P (con 1 <= P <= 5) che rappresenta la priorità, seguito da stringa D che rappresenta il dato.
*/

app.post("/importDataFromFile", upload.single("upload"), (req, res) => {
    res.sendStatus(200);
});

app.get("/pendingData", (req, res) => {
    res.sendStatus(200);
});

interface DataEndpointQueryParams {
    from?: number;
    limit?: number;
}

app.get("/data", (req: Request<{}, {}, {}, DataEndpointQueryParams>, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log("Server started");
});
