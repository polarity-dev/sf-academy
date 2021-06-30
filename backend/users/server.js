const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const { join } = require('path');
const { promisify } = require('util');
const PORT = process.env.PORT || 9001;

const implementations = {
    signup: (call, callback) => {
        const { email, password, iban } = call.request;
        
        callback(null, {
            jwt: `Benvenuto ${email}!`,
        });
    },
};

const descriptor = grpc.loadPackageDefinition(protoLoader.loadSync("users.proto"));
const server = new grpc.Server();
server.bindAsync = promisify(server.bindAsync);
server
    .bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure())
    .then(() => {
        server.addService(descriptor.users.Users.service, implementations);
        server.start();
        console.log('gRPC server started on port %O', PORT);
    })
    .catch(console.log);
