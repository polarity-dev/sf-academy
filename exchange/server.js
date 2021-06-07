const protoLoader = require("@grpc/proto-loader")
const grpc = require("@grpc/grpc-js")
const { join } = require("path")
const { promisify } = require("util")
const { default: axios } = require("axios")
const { PORT = 9000 } = process.env
const xml2js = require('xml2js')

const implementations = {
    exchange: async (call, callback) => {
        //functional part here
        console.log(call.request);
        const { value, from, to } = call.request;
        if (value === undefined || value === null || typeof value != "number") return callback({ code: grpc.status.INVALID_ARGUMENT, error: "missing or wrong 'value' field" })
        if (from === undefined || from === null || !["EUR", "USD"].includes(from.toUpperCase())) return callback({ code: grpc.status.INVALID_ARGUMENT, error: "missing or wrong 'from' field" })
        if (to === undefined || to === null || !["EUR", "USD"].includes(to.toUpperCase())) return callback({ code: grpc.status.INVALID_ARGUMENT, error: "missing or wrong 'to' field" })
        if (to.toUpperCase() === from.toUpperCase()) return callback(null, { value: value })
        //call to BCE
        const xml = await axios.get(`https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml`).then(r => r.data).catch(err => 1)
        //if some error occuers
        if (xml === 1) return callback({ code: grpc.status.INTERNAL, message: "Could not get XML" })
        //get the wxchange rate
        const rate = await xml2js.parseStringPromise(xml).then((result) => {
            return result['gesmes:Envelope'].Cube[0].Cube[0].Cube[0]['$']
        })

        console.log(rate);

        const finalFrom = from.toUpperCase()
        //const finalTo = to.toUpperCase()
        //calculate value
        let newValue = 0;
        if (finalFrom === "EUR") {
            newValue = value * rate.rate;
        } else {
            newValue = value / rate.rate;
        }

        console.log(newValue);


        return callback(null, {
            value: newValue
        })
    }
}


const descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "./proto/exchange.proto")))
const server = new grpc.Server()
server.bindAsync = promisify(server.bindAsync)
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure())
    .then(() => {
        server.addService(descriptor.exchange.Exchanger.service, implementations)
        server.start()
        console.log("grpc server started on port %O", PORT)
    })
    .catch(console.log)