const express = require('express');
const bodyParser = require('body-parser');
const { initialize } = require('express-openapi');
const PORT = process.env.PORT || 9002;
const cors = require('cors');
const { join } = require('path');

// General gRPC setup
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');

// gRPC Client for Users
const descriptorUsers = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, './proto/users.proto')));
const grpcUsersClient = new descriptorUsers.users.Users('0.0.0.0:9001', grpc.credentials.createInsecure());

// gRPC Client for Exchange
const descriptorExchange = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, './proto/exchange.proto')));
const grpcExchangeClient = new descriptorExchange.exchange.Exchange('0.0.0.0:9000', grpc.credentials.createInsecure());

const operations = {
    exchange: async (req, res, next) => {
        try {
            const { value, from, to } = req.query;
            await grpcExchangeClient.exchange({ value, from, to }, (err, data) => {
                if (err) {
                    return res.status(400).json({ error: err.details });
                }
                return res.status(200).json({ status: 'OK', data: data });
            });
        } catch (error) {
            return res.status(500).json({ error: error.details });
        }
    },
    signup: async (req, res, next) => {
        try {
            const { username, email, password, iban } = req.body;

            await grpcUsersClient.signup({ username, email, password, iban }, (err, data) => {
                if (err) {
                    return res.status(400).json({ error: err.details });
                }
                return res.status(200).json({ status: 'OK', data: data });
            });
        } catch (error) {
            return res.status(500).json({ error: error.details });
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            await grpcUsersClient.login({ email, password }, (err, data) => {
                if (err) {
                    return res.status(400).json({ error: err.details });
                }
                return res.status(200).json({ status: 'OK', data: data });
            });
        } catch (error) {
            return res.status(500).json({ error: error.details });
        }
    },
    deposit: async (req, res, next) => {
        try {
            const { token, value, symbol } = req.body;

            await grpcUsersClient.deposit({ token, value, symbol }, (err, data) => {
                if (err) {
                    return res.status(400).json({ error: err.details });
                }
                return res.status(200).json({ status: 'OK', data: data });
            });
        } catch (error) {
            return res.status(500).json({ error: error.details });
        }
    },
    withdraw: async (req, res, next) => {
        try {
            const { token, value, symbol } = req.body;

            await grpcUsersClient.withdraw({ token, value, symbol }, (err, data) => {
                if (err) {
                    return res.status(400).json({ error: err.details });
                }
                return res.status(200).json({ status: 'OK', data: data });
            });
        } catch (error) {
            return res.status(500).json({ error: error.details });
        }
    },
    buy: async (req, res, next) => {
        try {
            const { token, value, symbol } = req.body;

            await grpcUsersClient.buy({ token, value, symbol }, (err, data) => {
                if (err) {
                    return res.status(400).json({ error: err.details });
                }
                return res.status(200).json({ status: 'OK', data: data });
            });
        } catch (error) {
            return res.status(500).json({ error: error.details });
        }
    },
    listTransactions: async (req, res, next) => {
        try {
            const { token, from, to, symbol } = req.query;

            await grpcUsersClient.listTransactions({ token, from, to, symbol }, (err, data) => {
                if (err) {
                    return res.status(400).json({ error: err.details });
                }
                return res.status(200).json({ status: 'OK', data: data });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.details });
        }
    },
    currentBalance: async (req, res, next) => {
        try {
            const { token } = req.query;

            await grpcUsersClient.currentBalance({ token }, (err, data) => {
                if (err) {
                    return res.status(400).json({ error: err.details });
                }
                return res.status(200).json({ status: 'OK', data: data });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.details });
        }
    },
};

const app = express();
app.use(bodyParser.json());
app.use(cors());

initialize({
    app,
    errorMiddleware: (err, req, res, next) => {
        res.json(err);
    },
    apiDoc: join(__dirname, './apiDoc.yml'),
    dependencies: {
        log: console.log,
    },
    operations,
});

app.listen(PORT, () => {
    console.log('API listening on port %O', PORT);
});
