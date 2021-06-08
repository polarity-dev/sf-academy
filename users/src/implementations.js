const Db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validate, getDecoded } = require('./handleJWT')
const { status } = require("@grpc/grpc-js")
const grpc = require("@grpc/grpc-js")
const { descriptor } = require("../descriptor")
const grpcExchange = new descriptor.exchange.Exchanger("exchange:9000", grpc.credentials.createInsecure())

const signup = async (call, callback) => {
    try {
        const db = new Db();
        const { email, password, name, iban } = call.request;

        const p = await bcrypt.hash(password.trim(), 5);
        const e = email.trim().toLowerCase();
        const n = name.toLowerCase();

        const id = await db.query(
            `INSERT INTO users(email, password, name, iban) values ('${e}','${p}','${n}', '${iban}')`
        ).then(r => r.insertId)
        const user = await db.query(
            `
                select u.id, u.name, u.email, u.iban from users u where u.id=${id}
            `
        ).then(r => r[0])

        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            iban: user.iban
        }, process.env.JWT_SECRET);


        db.con.end();
        return callback(null, {
            success: true,
            token: token
        })
    } catch (error) {
        return callback({
            code: status.INTERNAL,
            message: error
        })
    }
}

const login = async (call, callback) => {
    try {
        const db = new Db();
        const { email, password } = call.request;
        const e = email.toLowerCase()
        const user = await db.query(
            `
                select u.id, u.name, u.email, u.password, u.iban from users u where u.email='${e}'
            `
        ).then(r => r[0])
        if (user === undefined) return callback({ code: status.NOT_FOUND, message: "No user with this email" }, null)
        if (!(await bcrypt.compare(password, user.password))) return callback({ code: status.INVALID_ARGUMENT, message: "Wrong email/password" }, null)

        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            iban: user.iban
        }, process.env.JWT_SECRET);

        db.con.end()
        return callback(null, {
            success: true,
            token: token
        })
    } catch (error) {
        return callback({
            code: status.INTERNAL,
            message: error
        }, null)
    }
}

const deposit = async (call, callback) => {
    try {
        const db = new Db();
        const { token, value, symbol } = call.request;

        validate(token);
        console.log("DEPOSIT", call.request);
        const user = getDecoded(token);
        console.log("USER", user);

        if (symbol === "USD") {
            const balanceUSD = await db.query(
                `select u.balanceUSD from users u where u.id=${user.id}`
            ).then(r => r[0].balanceUSD)
            await db.query(
                `update users set balanceUSD=${balanceUSD + value} where id=${user.id}`
            )
        }
        else if (symbol === 'EUR') {
            const balanceEUR = await db.query(
                `select u.balanceEUR from users u where u.id=${user.id}`
            ).then(r => r[0].balanceEUR)
            await db.query(
                `update users set balanceEUR=${balanceEUR + value} where id=${user.id}`
            )
        }

        await db.query(`insert into transactions(transType, value, symbol, idUser) values ('deposit',${value} ,'${symbol}', ${user.id}); `)
            .then(r => console.log);

        const balance = await db.query(
            `select u.balanceEUR, u.balanceUSD from users u where u.id=${user.id}`
        ).then(r => r[0])


        db.con.end()
        return callback(null, {
            data: balance
        })
    } catch (error) {
        console.log(error);
        if (error === "AUTH_ERROR") return callback({ message: "Auth Token not valid", code: status.UNAUTHENTICATED }, null)
        if (error === "INVALID") return callback({ code: status.INVALID_ARGUMENT, message: "invalid value argument" }, null)
        if (typeof error !== "string")
            return callback({
                message: error.message,
                code: status.INTERNAL
            })
    }
}

const withdraw = async (call, callback) => {
    try {
        const db = new Db();
        const { token, value, symbol } = call.request;

        console.log(call.request);
        validate(token);

        const user = getDecoded(token);

        if (symbol === 'USD') {
            const balanceUSD = await db.query(
                `select u.balanceUSD from users u where u.id=${user.id}`
            ).then(r => r[0].balanceUSD);
            if (balanceUSD < value) throw "INVALID"
            await db.query(
                `update users set balanceUSD=${balanceUSD - value} where id=${user.id}`
            )
        }
        else if (symbol === 'EUR') {
            const balanceEUR = await db.query(
                `select u.balanceEUR from users u where u.id=${user.id}`
            ).then(r => r[0].balanceEUR);

            if (balanceEUR < value) throw "INVALID"

            await db.query(
                `update users set balanceEUR=${balanceEUR - value} where id=${user.id}`
            )
        }

        await db.query(`insert into transactions(transType, value, symbol, idUser) values ('withdraw',${value} ,'${symbol}', ${user.id}); `)

        const balance = await db.query(
            `select u.balanceEUR, u.balanceUSD from users u where u.id=${user.id}`
        ).then(r => r[0])

        db.con.end()
        return callback(null, {
            data: balance
        })
    } catch (error) {
        if (error === "AUTH_ERROR") return callback({ message: "Auth Token not valid", code: status.UNAUTHENTICATED }, null)
        if (error === "INVALID") return callback({ code: status.INVALID_ARGUMENT, message: "can't perform operation due to money insufficience" }, null)
        return callback({
            code: status.INTERNAL,
            message: error
        })
    }
}


module.exports = {
    signup, login, deposit, withdraw
}