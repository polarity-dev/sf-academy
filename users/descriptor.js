const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
const { join } = require("path")
const descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "./proto/exchange.proto")))

module.exports = {
    descriptor
}