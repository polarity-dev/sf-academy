const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const { join } = require('path');
const { promisify } = require('util');
const PORT = process.env.PORT || 9001;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var atob = require('atob');
const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: process.env.DATABASE_URI,
//     port: 3306,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
// });

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'exchange_microservice_database',
});

const promisePool = pool.promise();

const checkDates = (from, to) => {
    const date1 = new Date(from);
    const date2 = new Date(to);
    return date1 > date2;
};

const getCurrentDATETIME = () => {
    // MySQL DATETIME Format: YYYY-MM-DD hh:mm:ss
    const currentDate = Date.now();
    const dateObject = new Date(currentDate);
    const YYYY = dateObject.getFullYear();
    const MM = dateObject.getMonth() + 1;
    const DD = dateObject.getDate();
    const hh = dateObject.getHours();
    const mm = dateObject.getMinutes();
    const ss = dateObject.getSeconds();

    const DATETIME = `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;

    return DATETIME;
};

const financial = (value) => {
    return Number.parseFloat(value).toFixed(2);
};

const checkEmpty = (string) => {
    return string === undefined || string === null || string === '';
};

const getDataFromJWT = (jwt) => {
    try {
        return JSON.parse(atob(jwt.split('.')[1]));
    } catch {
        throw 'Error parsing JWT.';
    }
};

const clientDescriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, './proto/exchange.proto')));
// const grpcClient = new clientDescriptor.exchange.Exchange('exchange:9000', grpc.credentials.createInsecure());
const grpcClient = new clientDescriptor.exchange.Exchange('0.0.0.0:9000', grpc.credentials.createInsecure());

const implementations = {
    signup: async (call, callback) => {
        try {
            let { username, email, password, iban } = call.request;

            username = username.trim().toLowerCase();
            email = email.trim().toLowerCase();
            password = await bcrypt.hash(password.trim(), 10);
            iban = iban.toUpperCase();

            try {
                await promisePool.query('INSERT INTO user(username, email, password, iban) VALUES (?, ?, ?, ?)', [username, email, password, iban]);
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return callback({ code: grpc.status.ALREADY_EXISTS, message: 'An account with the inserted email already exists.' });
                }
                return callback({ code: grpc.status.INTERNAL, message: error });
            }
            return callback(null, { code: grpc.status.OK, response: 'Sign up went fine!' });
        } catch (err) {
            return callback({ code: grpc.status.INTERNAL, message: err });
        }
    },
    login: async (call, callback) => {
        let { email, password } = call.request;

        if (checkEmpty(email)) {
            return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Invalid argument: 'email'" });
        }
        if (checkEmpty(password)) {
            return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Invalid argument: 'password'" });
        }

        email = email.trim().toLowerCase();

        let passwordHash = '';

        try {
            const [rows, schema] = await promisePool.query('SELECT * FROM user WHERE email = ?', [email]);
            if (rows.length === 0) {
                return callback({ code: grpc.status.UNAUTHENTICATED, message: 'Log in failed!' });
            } else {
                const userData = rows[0];
                passwordHash = userData.password;
                try {
                    const match = await bcrypt.compare(password, passwordHash);
                    if (match) {
                        // const token = jwt.sign({ id: userData.id, username: userData.username, email: userData.email, iban: userData.iban }, process.env.JWT_SECRET);
                        const token = jwt.sign({ id: userData.id, username: userData.username, email: userData.email, iban: userData.iban }, 'test123');
                        return callback(null, { code: grpc.status.OK, token: token });
                    } else {
                        return callback({ code: grpc.status.UNAUTHENTICATED, message: 'Log in failed!' });
                    }
                } catch (error) {
                    return callback({ code: grpc.status.UNKNOWN, message: error });
                }
            }
        } catch (error) {
            return callback({ code: grpc.status.UNKNOWN, message: error });
        }
    },
    deposit: async (call, callback) => {
        const { token, value, symbol } = call.request;
        try {
            // jwt.verify(token, process.env.JWT_SECRET);
            jwt.verify(token, 'test123');
        } catch {
            return callback({ code: grpc.status.UNAUTHENTICATED, message: 'Token is invalid!' });
        }

        try {
            const { id } = getDataFromJWT(token);
            const [results, schema] = await promisePool.query('SELECT * FROM user WHERE id = ?', [id]);
            let eurBalance = results[0].eur_balance;
            let usdBalance = results[0].usd_balance;
            if (symbol == '$') {
                usdBalance = usdBalance + value;
            } else if (symbol == '€') {
                eurBalance = eurBalance + value;
            } else {
                return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Invalid argument: 'symbol'" });
            }
            await promisePool.query('INSERT INTO exchange(transaction_type, value, currency, fk_id_user) VALUES (?, ?, ?, ?)', ['deposit', value, symbol, id]);
            await promisePool.query('UPDATE user SET eur_balance = ?, usd_balance = ? WHERE id = ?', [eurBalance, usdBalance, id]);
            const [rows, schm] = await promisePool.query('SELECT * FROM user WHERE id = ?', [id]);
            return callback(null, { code: grpc.status.OK, eurCurrent: rows[0].eur_balance, usdCurrent: rows[0].usd_balance });
        } catch (error) {
            return callback({ code: grpc.status.INTERNAL, message: error });
        }
    },
    withdraw: async (call, callback) => {
        const { token, value, symbol } = call.request;
        try {
            // jwt.verify(token, process.env.JWT_SECRET);
            jwt.verify(token, 'test123');
        } catch {
            return callback({ code: grpc.status.UNAUTHENTICATED, message: 'Token is invalid!' });
        }

        try {
            const { id } = getDataFromJWT(token);
            const [results, schema] = await promisePool.query('SELECT * FROM user WHERE id = ?', [id]);
            let eurBalance = results[0].eur_balance;
            let usdBalance = results[0].usd_balance;
            if (symbol == '$') {
                usdBalance = usdBalance - value;
                if (usdBalance < 0) {
                    return callback({ code: grpc.status.ERROR, message: 'Insufficient funds.' });
                }
            } else if (symbol == '€') {
                eurBalance = eurBalance - value;
                if (eurBalance < 0) {
                    return callback({ code: grpc.status.ERROR, message: 'Insufficient funds.' });
                }
            } else {
                return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Invalid argument: 'symbol'" });
            }
            await promisePool.query('INSERT INTO exchange(transaction_type, value, currency, fk_id_user) VALUES (?, ?, ?, ?)', ['withdraw', value, symbol, id]);
            await promisePool.query('UPDATE user SET eur_balance = ?, usd_balance = ? WHERE id = ?', [eurBalance, usdBalance, id]);
            const [rows, schm] = await promisePool.query('SELECT * FROM user WHERE id = ?', [id]);
            return callback(null, { code: grpc.status.OK, eurCurrent: rows[0].eur_balance, usdCurrent: rows[0].usd_balance });
        } catch (error) {
            return callback({ code: grpc.status.INTERNAL, message: error });
        }
    },
    buy: async (call, callback) => {
        const { token, value, symbol } = call.request;
        try {
            // jwt.verify(token, process.env.JWT_SECRET);
            jwt.verify(token, 'test123');
        } catch {
            return callback({ code: grpc.status.UNAUTHENTICATED, message: 'Token is invalid!' });
        }

        let from = '';
        let to = '';

        if (symbol == '$') {
            from = 'USD';
            to = 'EUR';
        } else if (symbol == '€') {
            from = 'EUR';
            to = 'USD';
        } else {
            return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Invalid argument: 'symbol'" });
        }

        try {
            await grpcClient.exchange({ value, from, to }, async (err, data) => {
                const convertedValue = data.value;
                try {
                    const { id } = getDataFromJWT(token);
                    const [results, schema] = await promisePool.query('SELECT * FROM user WHERE id = ?', [id]);

                    let eurBalance = results[0].eur_balance;
                    let usdBalance = results[0].usd_balance;

                    if (symbol == '$') {
                        console.log('CONVERTING USD TO EUR');
                        usdBalance = financial(usdBalance - value);
                        eurBalance = financial(eurBalance + convertedValue);
                    } else {
                        console.log('CONVERTING EUR TO USD');
                        eurBalance = financial(eurBalance - value);
                        usdBalance = financial(usdBalance + convertedValue);
                    }

                    if (usdBalance < 0 || eurBalance < 0) {
                        return callback({ code: grpc.status.ERROR, message: 'Insufficient funds.' });
                    }

                    await promisePool.query('INSERT INTO exchange(transaction_type, value, currency, converted_value, fk_id_user) VALUES (?, ?, ?, ?, ?)', ['buy', value, symbol, convertedValue, id]);

                    await promisePool.query('UPDATE user SET eur_balance = ?, usd_balance = ? WHERE id = ?', [eurBalance, usdBalance, id]);
                    const [rows, schm] = await promisePool.query('SELECT * FROM user WHERE id = ?', [id]);
                    return callback(null, { code: grpc.status.OK, eurCurrent: rows[0].eur_balance, usdCurrent: rows[0].usd_balance });
                } catch (error) {
                    console.log(error);
                }
                return callback(null, { code: grpc.status.OK, eurCurrent: 12039, usdCurrent: 1203 });
            });
        } catch (error) {
            return callback({ code: grpc.status.UNKNOWN, message: error });
        }
    },
    listTransactions: async (call, callback) => {
        const { token } = call.request;
        let { from, to, symbol } = call.request;
        try {
            // jwt.verify(token, process.env.JWT_SECRET);
            jwt.verify(token, 'test123');
        } catch {
            return callback({ code: grpc.status.UNAUTHENTICATED, message: 'Token is invalid!' });
        }

        try {
            const { id } = getDataFromJWT(token);
            if (checkEmpty(from)) {
                from = '1970-01-01 00:00:00';
            }
            if (checkEmpty(to)) {
                to = getCurrentDATETIME();
            }
            if (from === to) {
                from += ' 00:00:00';
                to += ' 23:59:59';
            }
            if (checkDates(from, to)) {
                [from, to] = [to, from];
            }
            if (checkEmpty(symbol)) {
                symbol = '_';
            }
            if (!checkEmpty(from) && !checkEmpty(to) && !checkEmpty(symbol)) {
                const query = promisePool.format('SELECT * FROM exchange WHERE fk_id_user = ? AND currency LIKE ? AND execution_date BETWEEN ? AND ? ORDER BY id ASC', [id, symbol, from, to]);
                console.log(query);
                const [results, schema] = await promisePool.query(query);
                const transactions = [];

                results.forEach(({ id, execution_date, transaction_type, value, currency, converted_value }) => {
                    transactions.push({
                        id: id,
                        date: execution_date,
                        type: transaction_type,
                        value: value,
                        currency: currency,
                        convertedValue: converted_value,
                    });
                });
                return callback(null, { code: grpc.status.OK, transactions: transactions });
            }
        } catch (error) {
            return callback({ code: grpc.status.INTERNAL, message: error });
        }
    },
    currentBalance: async (call, callback) => {
        try {
            let { token } = call.request;

            try {
                // jwt.verify(token, process.env.JWT_SECRET);
                jwt.verify(token, 'test123');
            } catch {
                return callback({ code: grpc.status.UNAUTHENTICATED, message: 'Token is invalid!' });
            }

            const { id } = getDataFromJWT(token);

            try {
                const [results, schema] = await promisePool.query('SELECT * FROM user WHERE id = ?', [id]);
                return callback(null, { code: grpc.status.OK, eurCurrent: results[0].eur_balance, usdCurrent: results[0].usd_balance });
            } catch (error) {
                return callback({ code: grpc.status.INTERNAL, message: error });
            }
        } catch (err) {
            return callback({ code: grpc.status.INTERNAL, message: err });
        }
    },
};

const descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, './proto/users.proto')));
const server = new grpc.Server();
server.bindAsync = promisify(server.bindAsync);
server
    .bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure())
    .then(() => {
        server.addService(descriptor.users.Users.service, implementations);
        server.start();
        console.log('gRPC server started on port %O', PORT);
    })
    .catch(console.log);
