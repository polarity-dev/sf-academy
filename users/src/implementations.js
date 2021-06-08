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


module.exports = {
    signup, login
}