"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const mysql2_1 = __importDefault(require("mysql2"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
const app = (0, express_1.default)();
const port = 49160;
const pagesDirectory = path_1.default.resolve(process.cwd(), "./");
app.use("/css", express_1.default.static("css"));
app.get("/", (request, response) => {
    sendPage(response, "text/html", 200, "pages/index.html");
});
app.get("style.css", (request, response) => {
    sendPage(response, "text/css", 200, "css/style.css");
});
app.post("/importDataFromFile", upload.single("fileInput"), async (request, response) => {
    fs_1.default.readFile("utility/dataToProcess.json", "utf-8", (error, JSONdata) => {
        if (error) {
            console.log(error);
            return;
        }
        try {
            fs_1.default.readFile(request.file.path, "utf-8", (error, data) => {
                if (error) {
                    console.log(error);
                    return;
                }
                let myData = data.split("\n");
                let A = parseInt(myData[0].split(" ")[0]);
                let B = parseInt(myData[0].split(" ")[1]);
                let filteredData = myData.filter((row, index) => (index >= A && index <= B));
                let tempArray = [];
                filteredData.forEach((row, index) => {
                    row.replace("\r", "");
                    let elements = row.split(" ");
                    let myObj = {
                        P: parseInt(elements[0]),
                        K: parseInt(elements[1]),
                        D: elements[2].replace(/\r|\n/g, ""),
                        timestamp: 0
                    };
                    tempArray.push(myObj);
                });
                const dataArray = JSON.parse(JSONdata).concat(tempArray);
                dataArray.sort((a, b) => b.P - a.P);
                fs_1.default.writeFile("utility/dataToProcess.json", JSON.stringify(dataArray), (error) => {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    fs_1.default.unlink(path_1.default.join(request.file.path), (error) => {
                        if (error) {
                            console.log(error);
                            return;
                        }
                    });
                    console.log("[File dato in input aggiunto ai dati da processare]");
                });
            });
        }
        catch (error) {
            console.log("[Nessun file dato in input]");
            return;
        }
    });
    sendPage(response, "text/html", 200, "pages/index.html");
});
app.get("/pendingData", (request, response) => {
    fs_1.default.readFile("utility/dataToProcess.json", "utf-8", (error, data) => {
        if (error) {
            console.log(error);
            return;
        }
        const dataArray = JSON.parse(data);
        response.send(dataArray);
    });
});
app.get("/data", (request, response) => {
    const queryObj = request.query;
    fs_1.default.readFile("utility/processedData.json", "utf-8", (error, data) => {
        if (error) {
            console.log(error);
            return;
        }
        let dataArray = JSON.parse(data);
        if (queryObj.from) {
            console.log("FROM", queryObj.from, typeof queryObj.from);
            dataArray = dataArray.filter((obj) => obj.timestamp > queryObj.from);
        }
        if (queryObj.limit) {
            console.log("LIMIT", queryObj.limit, typeof queryObj.limit);
            dataArray = dataArray.filter((obj, index) => (index < parseInt(queryObj.limit)));
        }
        response.send(dataArray);
    });
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
let myInterval = setInterval(() => {
    console.log("[-Intervallo 10 secondi-]");
    fs_1.default.readFile("utility/dataToProcess.json", "utf-8", (error, data) => {
        if (error) {
            console.log(error);
            return;
        }
        if (data == "[]") {
            return;
        }
        let inputDataArray = JSON.parse(data);
        let cutArray = inputDataArray.slice(0, 15).filter((obj) => {
            if (obj)
                return true;
            return false;
        });
        let remainingDataArray;
        if (inputDataArray.length > 15) {
            remainingDataArray = inputDataArray.slice(15, inputDataArray.length);
        }
        else {
            remainingDataArray = [];
        }
        fs_1.default.writeFile("utility/dataToProcess.json", JSON.stringify(remainingDataArray), (error) => {
            if (error) {
                console.log(error);
                return;
            }
        });
        const connection = mysql2_1.default.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "",
            database: "messaggi",
            connectTimeout: 5000
        });
        connection.connect((error) => {
            if (error) {
                console.log(error);
                return;
            }
        });
        cutArray.forEach((obj) => {
            const sqlStr = `INSERT INTO messaggi (K, D, timestamp) VALUES (?, ?, ?)`;
            obj.timestamp = formatDateForSQL(new Date(Date.now()));
            connection.query(sqlStr, [obj.K, obj.D, obj.timestamp], (error, results) => {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log(JSON.stringify(results));
            });
        });
        connection.end();
        fs_1.default.readFile("utility/processedData.json", "utf-8", (error, data) => {
            if (error) {
                console.log(error);
                return;
            }
            let inputDataArray = JSON.parse(data).concat(cutArray);
            fs_1.default.writeFile("utility/processedData.json", JSON.stringify(inputDataArray), (error) => {
                if (error) {
                    console.log(error);
                    return;
                }
            });
        });
    });
}, 10000);
function sendPage(response, ContentType, statusCode, url) {
    response.setHeader("Content-Type", ContentType);
    response.status(statusCode);
    response.sendFile(url, { root: pagesDirectory });
}
function formatDateForSQL(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    let hour = date.getHours().toString().padStart(2, "0");
    let minute = date.getMinutes().toString().padStart(2, "0");
    let second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
