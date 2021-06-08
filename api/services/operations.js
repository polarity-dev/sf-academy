const { descriptor } = require("../descriptor")
const grpc = require("@grpc/grpc-js")
const grpcUsers = new descriptor.users.Users("users:9001", grpc.credentials.createInsecure())


const signUp = async (req, res) => {
    try {
        const { email, password, name, iban } = req.body;

        if (email === undefined || email === null || email === "") throw "Bad Request wrong email field";
        if (password === undefined || password === null || password.length < 8) throw "Bad Request wrong password field, at least 8 chars";
        if (name === undefined || name === null || name === "") throw "Bad Request wrong name field";
        if (iban === undefined || iban === null || iban === "") throw "Bad Request wrong iban field";

        grpcUsers.signup({ email, password, name, iban }, (err, data) => {
            console.log(err, data);
            if (data) return res.status(201).json({ status: "ok", data: data.token })
            if (err) return GRPCerrorHandler(err, res)
        })


    } catch (error) {
        errorHandler(error, res)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === undefined || email === null || email === "") throw "Bad Request wrong email field";
        if (password === undefined || password === null || password.length < 8) throw "Bad Request wrong password field, at least 8 chars";

        grpcUsers.login({ email, password }, (err, data) => {
            console.log(err, data);
            if (data) return res.status(200).json({ status: "ok", data: data.token })
            if (err) return GRPCerrorHandler(err, res)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

const deposit = async (req, res) => {
    try {
        const { token, value, symbol } = req.body;
        if (token === undefined || token === null || token === "") throw "Bad Request wrong token field";
        if (value === undefined || value === null || value < 0) throw "Bad Request wrong value field";
        if (symbol === undefined || symbol === null || (symbol !== "EUR" && symbol !== "USD")) throw "Bad Request wrong symbol field";

        grpcUsers.deposit({ token, value, symbol }, (err, data) => {
            console.log(err, data);
            if (data) return res.status(200).json({ status: "ok", data: data.data })
            if (err) return GRPCerrorHandler(err, res)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

const withdraw = async (req, res) => {
    try {
        const { token, value, symbol } = req.body;
        if (token === undefined || token === null || token === "") throw "Bad Request wrong token field";
        if (value === undefined || value === null || value < 0) throw "Bad Request wrong value field";
        if (symbol === undefined || symbol === null || (symbol !== "EUR" && symbol !== "USD")) throw "Bad Request wrong symbol field";

        grpcUsers.withdraw({ token, value, symbol }, (err, data) => {
            console.log(err, data);
            if (data) return res.status(200).json({ status: "ok", data: data.data })
            if (err) return GRPCerrorHandler(err, res)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

const balance = async (req, res) => {
    try {
        const { token } = req.query;
        if (token === undefined || token === null || token === "") throw "Bad Request wrong token field";

        grpcUsers.getBalance({ token }, (err, data) => {
            console.log(err, data);
            if (data) return res.status(200).json({ status: "ok", data: data.data })
            if (err) return GRPCerrorHandler(err, res)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

const buy = async (req, res) => {
    try {
        const { token, value, symbol } = req.body;
        if (token === undefined || token === null || token === "") throw "Bad Request wrong token field";
        if (value === undefined || value === null || value < 0) throw "Bad Request wrong value field";
        if (symbol === undefined || symbol === null || (symbol !== "EUR" && symbol !== "USD")) throw "Bad Request wrong symbol field";

        grpcUsers.buy({ token, value, symbol }, (err, data) => {
            console.log(err, data);
            if (data) return res.status(200).json({ status: "ok", data: data.data })
            if (err) return GRPCerrorHandler(err, res)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

const transactions = async (req, res) => {
    try {
        const { token, symbol, from, to } = req.query;
        if (token === undefined || token === null || token === "") throw "Bad Request wrong token field";
        if (symbol !== undefined) {
            if (symbol === null || (symbol !== "EUR" && symbol !== "USD")) throw "Bad Request wrong symbol field";
        }
        if (from !== undefined && to !== undefined) {
            if (from === null || from === "") throw "Bad Request wrong from field";
            if (to === null || to === "") throw "Bad Request wrong from field";
        }



        grpcUsers.listTransactions({ token, date: { from, to }, symbol }, (err, data) => {
            console.log(err, data);
            if (data) return res.status(200).json({ status: "ok", data: !data.data ? [] : data.data })
            if (err) return GRPCerrorHandler(err, res)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}

const exchangeValue = async (req, res) => {
    try {
        const { value, symbol } = req.query;
        if (value === undefined || value === null || value < 0) throw "Bad Request wrong value field";
        if (symbol === undefined || symbol === null || (symbol !== "EUR" && symbol !== "USD")) throw "Bad Request wrong symbol field";

        grpcUsers.exchangeValue({ value, symbol }, (err, data) => {
            console.log(err, data);
            if (data) return res.status(200).json({ status: "ok", data: data })
            if (err) return GRPCerrorHandler(err, res)
        })

    } catch (error) {
        errorHandler(error, res)
    }
}


function GRPCerrorHandler(err, res) {
    console.log(err);
    switch (err.code) {
        case 5: {
            return res.status(404).json({ status: "rejected", cause: err.details });
        }
        case 3: {
            return res.status(400).json({ status: "rejected", cause: err.details });
        }
        case 13: {
            return res.status(409).json({ status: "rejected", cause: err.details });

        }
        case 14: {
            return res.status(400).json({ status: "rejected", cause: err.details });
        }
        case 16: {
            return res.status(403).json({ status: "rejected", cause: err.details });
        }
    }
}

function errorHandler(error, res) {
    if (typeof error != "string") return res.status(500).json({ status: "rejected", cause: `Server Error ${error.message}` })
    if (error.includes("Bad Request")) return res.status(400).json({ status: "rejected", cause: error })
    else if (error.includes("Not Found")) return res.status(404).json({ status: "rejected", cause: error })
    else if (error.includes("Forbidden")) return res.status(403).json({ status: "rejected", cause: error });
    else if (error.includes("Conflict")) return res.status(409).json({ status: "rejected", cause: error });
    return res.status(422).json({ status: "rejected", error: error });
}

module.exports = {
    signUp, login, deposit, withdraw, balance, buy, transactions, exchangeValue
}