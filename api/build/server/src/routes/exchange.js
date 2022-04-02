"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exchangeClient_1 = require("../grpc_clients/exchangeClient");
module.exports = {
    exchange: (req, res) => {
        const value = parseFloat(req.query.value);
        const from = req.query.from;
        const to = req.query.to;
        console.log(value, from, to);
        exchangeClient_1.exchangeClient.Exchange({
            value,
            from,
            to
        }, (err, data) => {
            if (err)
                throw err;
            res.status(200).send(data);
        });
    }
};
