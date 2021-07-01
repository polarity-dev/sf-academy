const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const { join } = require('path');
const { promisify } = require('util');
const PORT = process.env.PORT || 9000;
const axios = require('axios');
const xml2js = require('xml2js');

const financial = (value) => {
    return Number.parseFloat(value).toFixed(2);
};

const implementations = {
    exchange: async (call, callback) => {
        const { value, from, to } = call.request;

        if (value === undefined || value === null || typeof value != 'number') {
            return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Invalid argument: 'value'" });
        }
        if (from === undefined || from === null || from === '' || !['eur', 'usd'].includes(from.toLowerCase())) {
            return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Invalid argument: 'from'" });
        }
        if (to === undefined || to === null || to === '' || !['eur', 'usd'].includes(to.toLowerCase())) {
            return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Invalid argument: 'to'" });
        }

        const ECB_URI = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

        axios
            .get(ECB_URI)
            .then((xml) => {
                xml2js.parseString(xml.data, (error, result) => {
                    const usdConversionRate = result['gesmes:Envelope'].Cube[0].Cube[0].Cube[0]['$'].rate;

                    if (from.toLowerCase() === to.toLowerCase()) {
                        return callback(null, {
                            code: grpc.status.OK,
                            value: financial(value),
                        });
                    } else {
                        if (from.toLowerCase() === 'eur') {
                            return callback(null, {
                                code: grpc.status.OK,
                                value: financial(value * usdConversionRate),
                            });
                        } else {
                            return callback(null, {
                                code: grpc.status.OK,
                                value: financial(value / usdConversionRate),
                            });
                        }
                    }
                });
            })
            .catch((error) => {
                return callback({ code: grpc.status.UNAVAILABLE, error: 'There was a problem getting XML, try again later.' });
            });
    },
};

const descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, './proto/exchange.proto')));
const server = new grpc.Server();
server.bindAsync = promisify(server.bindAsync);
server
    .bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure())
    .then(() => {
        server.addService(descriptor.exchange.Exchange.service, implementations);
        server.start();
        console.log('gRPC server started on port %O', PORT);
    })
    .catch((error) => {
        console.log(error);
    });
