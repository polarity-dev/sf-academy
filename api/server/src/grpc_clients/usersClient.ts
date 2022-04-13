import { join } from "path"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { ProtoGrpcType } from "../../../proto/users"

const PORT = process.env.USERS_PORT || 9000
const HOST = process.env.USERS_HOST || "0.0.0.0"

const PROTO_FILE = "../../../proto/users.proto"

const packageDef = protoLoader.loadSync(join(__dirname, PROTO_FILE))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType

const usersClient = new grpcObj.usersPackage.Users(
   `${HOST}:${PORT}`,
   grpc.credentials.createInsecure()
)

export default usersClient