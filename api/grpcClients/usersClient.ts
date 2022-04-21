import { join } from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "../proto/users";
import { usersHost, usersPort } from "../config";

const PROTO_FILE = "../proto/users.proto";

const packageDef = protoLoader.loadSync(join(__dirname, PROTO_FILE));
const grpcObj = grpc.loadPackageDefinition(
	packageDef
) as unknown as ProtoGrpcType;

const usersClient = new grpcObj.usersPackage.Users(
	`${usersHost}:${usersPort}`,
	grpc.credentials.createInsecure()
);

export default usersClient;
