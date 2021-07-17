const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { join } = require("path");
const { PORT = 9000 } = process.env;

const descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "./proto/exchange.proto")));
const client = new descriptor.exchange.ExchangeValue(`0.0.0.0:${PORT}`, grpc.credentials.createInsecure());

client.Exchange({amount:10, from:'USD', to:'EUR'}, (err, data) => {
  console.log({err, data });
})
