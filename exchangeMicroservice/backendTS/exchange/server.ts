import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoloader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/exchange";
import axios from "axios";
import dotenv from 'dotenv'
dotenv.config()
const PROTO_FILE = "./proto/exchange.proto";

const packageDef = protoloader.loadSync(path.resolve(__dirname, PROTO_FILE));
const grpcObj = grpc.loadPackageDefinition(
  packageDef
) as unknown as ProtoGrpcType;
const randomPackage = grpcObj.exchange;

const implementation = {
  exchange: async (
    call: {
      request: { currencyFrom: string; currencyTo: string; value: number };
    },
    callback: (arg0: Error | null, arg1: { value?: number }) => void
  ) => {
    try {
      const valutes = await axios.get(
        "http://api.exchangeratesapi.io/v1/latest?access_key=d0ea3e93d962ed51821442f6a42152af&format=1"
      );
      const { USD } = valutes.data.rates;
      if (
        call.request.currencyFrom === "€" &&
        call.request.currencyTo === "$"
      ) {
        const res = call.request.value * USD;
        
        callback(null, {
          value: res,
        });
      } else {
        const res = call.request.value / USD;

        callback(null, {
          value: res,
        });
      }
    } catch (err: any) {
      callback(err, {});
    }
  },
};
function main() {
  const server = getServer();
  server.bindAsync(
    `0.0.0.0:${process.env.PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Your server as started on port ${port}`);
      server.start();
    }
  );
}

function getServer() {
  const server = new grpc.Server();
  server.addService(randomPackage.Exchange.service, implementation);
  return server;
}

main();
