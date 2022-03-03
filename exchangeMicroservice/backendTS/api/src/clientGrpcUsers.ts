import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoloader from "@grpc/proto-loader";
import { ProtoGrpcType } from "../proto/users";
import dotenv from 'dotenv'
dotenv.config()
const PROTO_FILE = "../proto/users.proto";

const packageDef = protoloader.loadSync(path.resolve(__dirname, PROTO_FILE));
const grpcObj = grpc.loadPackageDefinition(
  packageDef
) as unknown as ProtoGrpcType;

const client = new grpcObj.users.Users(
  // `0.0.0.0:${PORT}`,
  `grpc-users-server:${process.env.USERSPORT}`,
  grpc.credentials.createInsecure()
);

module.exports= client



