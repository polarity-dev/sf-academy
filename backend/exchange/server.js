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

const checkNullOrUndefined = (element) => {
    return element === undefined || element === null;
};

const implementations = {
    exchange: async (call, callback) => {
        const { value, from, to } = call.request;

        if (checkNullOrUndefined(value) || typeof value != 'number') {
            return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Invalid argument: 'value'" });
        }
        if (checkNullOrUndefined(from) || from === '' || !['EUR', 'USD'].includes(from.toUpperCase())) {
            return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Invalid argument: 'from'" });
        }
        if (checkNullOrUndefined(to) || to === '' || !['EUR', 'USD'].includes(to.toUpperCase())) {
            return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Invalid argument: 'to'" });
        }

        const ECB_URI = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

        axios
            .get(ECB_URI)
            .then((xml) => {
                xml2js.parseString(xml.data, (error, result) => {
                    const usdConversionRate = result['gesmes:Envelope'].Cube[0].Cube[0].Cube[0]['$'].rate;

                    if (from.toUpperCase() === to.toUpperCase()) {
                        return callback(null, {
                            code: grpc.status.OK,
                            value: financial(value),
                        });
                    } else {
                        if (from.toUpperCase() === 'EUR') {
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
