const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
const { join } = require("path")
const descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "./proto/users.proto")))

module.exports = {
    descriptor
}