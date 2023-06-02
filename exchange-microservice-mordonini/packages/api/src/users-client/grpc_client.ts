// gRPC client interface
import { UsersServiceClient } from "../proto/services/users/v1/services_grpc_pb"

// gRPC login channel factory
import { ChannelCredentials }   from "@grpc/grpc-js";

import * as fs      from 'fs';
import * as path    from 'path';

// Environment
const { 
    USERS_GRPC_SERVER_HOST = '0.0.0.0',
    USERS_GRPC_SERVER_PORT = 9002,
    ROOT_CERT_FILE      = '../../../../secrets/keys/sign/grpc_credentials/ca-cert.pem',
    CLIENT_KEY_FILE     = '../../../../secrets/keys/sign/grpc_credentials/client-key.pem',
    CLIENT_CERT_FILE    = '../../../../secrets/keys/sign/grpc_credentials/client-cert.pem',
    NODE_ENV = 'dev'
} = process.env

// Authentication
const root_cert         = fs.readFileSync(path.join(ROOT_CERT_FILE))
const client_cert       = fs.readFileSync(path.join(CLIENT_CERT_FILE))
const client_key        = fs.readFileSync(path.join(CLIENT_KEY_FILE))
const credentials       = (NODE_ENV === 'production')
                            ? ChannelCredentials.createSsl(root_cert, client_key, client_cert)
                            : ChannelCredentials.createInsecure()

const client = new UsersServiceClient(`${USERS_GRPC_SERVER_HOST}:${USERS_GRPC_SERVER_PORT}`, credentials)

export default client
