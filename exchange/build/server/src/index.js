"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const exchange_1 = require("./services/exchange");
const dotenv = __importStar(require("dotenv"));
const ENV_FILE = (process.env.NODE_ENV === "production" ? ".env" : ".env.dev");
dotenv.config({ path: (0, path_1.join)(__dirname, "../../../..", ENV_FILE) });
const PORT = process.env.EXCHANGE_PORT || 9000;
const PROTO_FILE = "../../proto/exchange.proto";
const packageDef = protoLoader.loadSync((0, path_1.join)(__dirname, PROTO_FILE));
const grpcObj = grpc.loadPackageDefinition(packageDef);
const exchangePackage = grpcObj.exchangePackage;
const server = new grpc.Server();
server.addService(exchangePackage.Exchange.service, {
    Exchange: exchange_1.Exchange
});
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), err => {
    if (err)
        throw err;
    console.log(`Listening grpc exchange server on port ${PORT}`);
    server.start();
});
