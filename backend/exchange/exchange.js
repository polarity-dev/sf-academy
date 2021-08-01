require('dotenv').config();
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const https = require('https');
const { join } = require("path");
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const PORT = process.env.PORT;

var xml_object;
var exchange_rates_EUR = new Map();

// Approximation at 4 decimals
function Round(number){
  return Math.round(number * 1e4)/ 1e4;
}

// Extract exchange rates for EUR from XML
function GetExchangeRates(){
  let header = Object.keys(xml_object)[0];
  let currency_list =  Object.values(xml_object[header].Cube[0].Cube[0])[1];
  for(let i = 0; i < currency_list.length; i++){
    eur_xxx = Object.values(currency_list[i])[0];
    exchange_rates_EUR.set(eur_xxx.currency, eur_xxx.rate);
  }
  console.log(exchange_rates_EUR);
}

// XML with exchange rates directly from ECB (updated there once per day)
function GetXML(){
  let data = ''
  https.get("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml", (res) => {
    res.on('data', (stream) => {
      data += stream;
    });
    res.on('end', () => {
      parser.parseString(data, (error, result) => {
        if(error === null) {
          xml_object = result;
          GetExchangeRates();
        }
        else {
          console.log(error);
        }
      });
    });
  });
}

// Execute currency conversion
function Exchange(call, callback){
  let amount = call.request.amount;
  let from = call.request.from;
  let to = call.request.to;
  let rate;

  if (from === "EUR") rate = exchange_rates_EUR.get(to);
  else if (to === "EUR") rate = 1/exchange_rates_EUR.get(from);
  else rate = exchange_rates_EUR.get(to)/exchange_rates_EUR.get(from)

  rate = Round(rate);
  let value = Round(amount * rate);
  console.log(`${amount} ${from} =  ${value} ${to}. Exchange rate ${rate}`);
  callback(null, {value: value});
}

function ExchangeRates(call, callback){
  callback(null, {rates: JSON.stringify(Array.from(exchange_rates_EUR.entries()))});
  console.log("Exchange rates request delivered");
}


const descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "../proto/exchange.proto")));
const server = new grpc.Server();

server.addService(descriptor.exchange.ExchangeValue.service, {Exchange: Exchange, ExchangeRates: ExchangeRates});
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  xml_object = GetXML();
  console.log("grpc exchange server started on port %O", PORT);
});
