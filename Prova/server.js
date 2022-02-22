import express from 'express';
import * as mongoDB from "mongodb";
const port = 8080;
const app = express();
app.use(express.urlencoded({ extended: true })); //parse del body delle POST
const url = "mongodb://root:secret@database:27017";
const client = new mongoDB.MongoClient(url);
await client.connect();
console.log("Connected successfully to db");
const db = client.db("db");
const utenti = db.collection("utenti");
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile("page.html", { root: '.' });
});
app.get('/listUsers', (req, res) => {
    var username = req.query.username;
    console.log("Richiesta ricerca utente: " + username);
    res.setHeader('Content-Type', 'application/json');
    utenti.findOne({ User: username }, { projection: { _id: 0 } }).then(u => {
        if (u === null) {
            res.send(JSON.stringify("Utente non trovato"));
            return;
        }
        res.send(JSON.stringify(u));
    }, error => { console.error(error); res.sendStatus(500); });
});
app.post('/addUser', (req, res) => {
    var username = req.body.username;
    var pwd = req.body.pwd;
    res.setHeader('Content-Type', 'text/html');
    console.log("Richiesta registrazione utente: " + username);
    utenti.findOne({ User: username }).then(u => {
        if (u !== null) {
            res.send("Impossibile aggiungere l'utente poichè l'username è già presente in database");
            return;
        }
        utenti.insertOne({ User: username, Password: pwd });
        res.send("Utente aggiunto al database");
    }, error => { console.error(error); res.sendStatus(500); });
});
app.post('/login', (req, res) => {
    var username = req.body.username;
    var query = { $and: [{ User: username }, { Password: req.body.pwd }] };
    console.log("Richiesto login utente: " + username);
    utenti.findOne(query).then(u => {
        if (u !== null) {
            res.sendStatus(200);
            return;
        }
        res.sendStatus(401);
    }, error => { console.error(error); res.sendStatus(500); });
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
