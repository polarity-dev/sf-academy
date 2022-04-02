"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exchange = void 0;
const xml2js_1 = __importDefault(require("xml2js"));
require("isomorphic-fetch");
const URL = "http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
const parser = new xml2js_1.default.Parser();
const Exchange = (call, callback) => {
    fetch(URL)
        .then(response => response.text())
        .then(content => parser.parseStringPromise(content))
        .then(data => data['gesmes:Envelope']['Cube'][0]['Cube'][0]['Cube'])
        .then(data => data.map((element) => element['$']))
        .then(data => {
        const rates = {};
        data.forEach((element) => {
            rates[element.currency] = parseFloat(element.rate);
        });
        rates["EUR"] = 1;
        return rates;
    })
        .then(rates => {
        const { value, from, to } = call.request;
        callback(null, {
            value: value * rates[to || ""] / rates[from || ""],
            symbol: to
        });
    })
        .catch(err => console.log(err));
};
exports.Exchange = Exchange;
