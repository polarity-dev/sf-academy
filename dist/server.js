const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const db = require("better-sqlite3")("./data.db");
const fs = require("fs");
const app = express();
const port = 3000;
var unprocessed = [];
app.use(fileUpload({ createParentPath: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile("./index.html", { root: "." });
});
app.get('/style.css', (req, res) => {
    res.sendFile("./style.css", { root: "." });
});
app.post('/importDataFromFile', (req, res) => {
    var file = req.files.filename.data.toString('ascii');
    file = file.split("\n");
    var start = file[0].split(" ")[0];
    var end = file[0].split(" ")[1];
    for (var n = start; n <= end; n++) {
        unprocessed.push({
            prio: file[n].split(" ", 1)[0],
            int: file[n].split(" ", 2)[1],
            string: file[n].substring(file[n].indexOf(" ", file[n].indexOf(" ") + 1) + 1)
        });
    }
    res.redirect("/");
});
app.get('/pendingData', (req, res) => {
    res.json(unprocessed);
});
app.get('/data', (req, res) => {
    var dataArray = db.prepare("SELECT * FROM data" + (() => { if (req.query.from)
        return " WHERE stamp>=" + req.query.from;
    else
        return ""; })() + " ORDER BY stamp" + (() => { if (req.query.limit)
        return " LIMIT " + req.query.limit;
    else
        return ""; })()).all();
    res.json(dataArray);
});
app.listen((process.env.PORT || 3000), () => {
    return console.log("Server running on port " + (process.env.PORT || 3000) + " in HTTP mode.");
});
setInterval(() => {
    var queue = unprocessed.sort(function (a, b) { return a.prio - b.prio; });
    var timestamp = Date.now();
    for (var i = 0; i < 15; i++) {
        if (queue.length) {
            var cursor = unprocessed.pop();
            db.prepare("INSERT INTO data (int, string, stamp) VALUES('" + cursor.int + "','" + cursor.string + "','" + timestamp + "')").run();
        }
    }
    return;
}, 10000);
//# sourceMappingURL=server.js.map