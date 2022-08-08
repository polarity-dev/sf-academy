"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var pg_1 = require("pg");
var fs = require("fs");
var readline = require("readline");
//Connessione al Database
dotenv_1["default"].config();
var pool = new pg_1.Pool({
    host: 'db',
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
    idleTimeoutMillis: 40000
});
var connectToDB = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, pool.connect()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
connectToDB();
//Variabili per la parametrizzazione del file che va a leggere (prova locale)
var dirBefore = "";
var howManyDirBefore = 0;
var nameFile = "filePriority";
var extensionFile = ".txt";
//Variabili per il salvataggio dei dati dal file
var fileStream;
var rl;
var A = 0;
var B = 0;
var P = [];
var K = [];
var D = [];
var j = 1;
var allData = [];
var sortedData;
//Variabili per le richieste
var app = (0, express_1["default"])();
//variabili per il database
dotenv_1["default"].config();
//Concatenazione dei parametri del file che va a leggere (prova locale)
for (var i = 0; i < howManyDirBefore; i++) {
    dirBefore = dirBefore + "../";
}
nameFile = dirBefore + nameFile + extensionFile;
//Salvataggio dei dati (prova locale)
function processLineByLine() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var i, t, limit, timerReduce, _loop_1, rl_1, rl_1_1, e_1_1, pSortedData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fileStream = fs.createReadStream(nameFile);
                    rl = readline.createInterface({
                        input: fileStream,
                        crlfDelay: Infinity
                    });
                    i = 0;
                    t = 0;
                    limit = 15;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    _loop_1 = function () {
                        var line = rl_1_1.value;
                        if (i == 0) { // se è la prima linea allora devo salvarmi A e B
                            A = +line.substring(0, line.indexOf(" "));
                            B = +line.substring(line.indexOf(" "));
                            console.log(A + " " + B);
                        }
                        else { //altrimenti devo salvarmi i dati p k d
                            if (i >= A && i <= B) { //solo quelli validi
                                if (limit > 0) { //controllo che possa ancora prendere dei dati
                                    console.log(i);
                                    P[t] = +line.substring(0, line.indexOf(" ")); // P è sempre all'inizio
                                    j = 1;
                                    do { // controllo per K che non ci siano degli spazi in più, un errore generico dato che non mi era chiaro se i dati dovessero essere controllati o meno (ho fatto solo un errore generico per ora)
                                        var internalLine = line.substring(line.indexOf(" ") + j);
                                        if (internalLine[0] != ' ') {
                                            K[t] = +internalLine.substring(0, internalLine.indexOf(" ")); //line.substring(line.indexOf(" ")+1,)); // mi salvo fino allo spazio che trova dopo
                                        }
                                        j++;
                                    } while (isNaN(K[t]) && j < 20); //se ci sono più di 20 spazi allora non va bene
                                    D[t] = line.substring(j + K[t].toString().length + P[t].toString().length);
                                    if (limit == 15) { //è il primo caso di input del messaggio
                                        var Timer_1 = 10;
                                        timerReduce = setInterval(function () {
                                            Timer_1 = Timer_1 - 1;
                                            if (Timer_1 < 0)
                                                limit = 15;
                                        }, 1000);
                                    }
                                    allData.push({ "P": P[t], "K": K[t], "D": D[t] }); //salvo i dati
                                }
                                else {
                                    while (limit <= 0) {
                                        true; //aspetto che limit sia un valore positivo
                                    }
                                    if (limit > 0) {
                                        clearInterval(timerReduce); //fermo la funzione del timer e inserisco il dato che avevo prima
                                        sortedData = allData.sort(function (a, b) { return (a.P > b.P) ? -1 : 1; }); //prendo tutti i dati dato che ormai sono al limite (se no non saprei quando ordinarli)
                                        for (var pSortedData = 0; pSortedData < sortedData.length; pSortedData++) {
                                            insertIntoDatabase(sortedData[pSortedData]);
                                        }
                                        allData = []; //svuoto alldata così che possa ricominciare a riempirsi
                                        P[t] = +line.substring(0, line.indexOf(" "));
                                        j = 1;
                                        do { // controllo per K che non ci siano degli spazi in più, un errore generico dato che non mi era chiaro se i dati dovessero essere controllati o meno (ho fatto solo un errore generico per ora)
                                            var internalLine = line.substring(line.indexOf(" ") + j);
                                            if (internalLine[0] != ' ') {
                                                K[t] = +internalLine.substring(0, internalLine.indexOf(" ")); //line.substring(line.indexOf(" ")+1,)); // mi salvo fino allo spazio che trova dopo
                                            }
                                            j++;
                                        } while (isNaN(K[t]) && j < 20); //se ci sono più di 20 spazi allora non va bene
                                        D[t] = line.substring(j + K[t].toString().length + P[t].toString().length);
                                        if (limit == 15) {
                                            var Timer_2 = 10;
                                            timerReduce = setInterval(function () {
                                                Timer_2 = Timer_2 - 1;
                                                if (Timer_2 < 0)
                                                    limit = 15;
                                            }, 1000);
                                        }
                                        allData.push({ "P": P[t], "K": K[t], "D": D[t] }); //salvo i dati
                                    }
                                }
                                //console.log(D[i-1]);
                                t++;
                                limit--;
                            }
                        }
                        i++;
                    };
                    rl_1 = __asyncValues(rl);
                    _b.label = 2;
                case 2: return [4 /*yield*/, rl_1.next()];
                case 3:
                    if (!(rl_1_1 = _b.sent(), !rl_1_1.done)) return [3 /*break*/, 5];
                    _loop_1();
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(rl_1_1 && !rl_1_1.done && (_a = rl_1["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(rl_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    limit = 15;
                    sortedData = allData.sort(function (a, b) { return (a.P > b.P) ? -1 : 1; });
                    for (pSortedData = 0; pSortedData < sortedData.length; pSortedData++) {
                        insertIntoDatabase(sortedData[pSortedData]);
                    }
                    allData = [];
                    return [2 /*return*/];
            }
        });
    });
}
//
processLineByLine();
function insertIntoDatabase(valueDataFile) {
    //console.log(pool);
    pool.query("INSERT INTO " + "valuedata" + "(valuep, valuek, valued, timestamp) VALUES (".concat(valueDataFile.P, ",").concat(valueDataFile.K, ",\"{valueDataFile.D.toString()}\",(to_timestamp(").concat(Date.now(), " / 1000.0)))"), function (err, res) {
        console.log(err, res);
    });
}
app.get('/pendingData', function (req, res) {
    res.status(200).json(allData);
});
app.get('/Data', function (req, res) {
    var from = req.query.from;
    var limit = req.query.limit;
    res.status(200).json(sortedData);
});
app.listen(5434);
