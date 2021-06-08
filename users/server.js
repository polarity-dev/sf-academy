const protoLoader = require("@grpc/proto-loader")
const grpc = require("@grpc/grpc-js")
const { join } = require("path")
const { promisify } = require("util")
const { PORT = 9001 } = process.env
const { signup, login, deposit, withdraw } = require("./src/implementations")

const implementations = {
    signup, login, deposit, withdraw
}


const descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "./proto/users.proto")))
const server = new grpc.Server()
server.bindAsync = promisify(server.bindAsync)
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure())
    .then(() => {
        server.addService(descriptor.users.Users.service, implementations)
        server.start()
        console.log("grpc server started on port %O", PORT)
    })
    .catch(console.log)