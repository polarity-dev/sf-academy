require('dotenv').config();
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { join } = require("path");
const mysql = require('mysql2');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const EXCH_PORT = process.env.EXCH_PORT;
const USERS_PORT = process.env.USERS_PORT;

// Hash function for encrypting passwords
String.prototype.hashCode = function(){
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    let character = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// Local mySQL database configurations
var db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Connection to local database
db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database");
});

const implementations = {

  Signup: (call, callback) => {
    let email = call.request.email;
    let name = call.request.name;
    let iban = call.request.iban;
    let hash = call.request.password.hashCode();

    let user = { email: email, password: hash, name: name, iban: iban };
    db.query("INSERT INTO users SET ?;", user)
      .then(res => {
        let token = jwt.sign({ user_id: res.insertId }, secret);
        console.log("SIGNUP SUCCESFUL. TOKEN = " + token);
        callback(null, {token: token, name: name, iban: iban, accounts:'{}'});
      }).catch(err => {
        callback(null, {errorCode: 401}); // Unexpected error - or email already in use
      });
  },

  Login: (call, callback) => {
    let email = call.request.email
    let hash = call.request.password.hashCode();

    db.query("SELECT * FROM users WHERE email= ? AND password= ?;", [email, hash])
      .then(res =>{
        if (res.length === 0)  callback(null, {errorCode: 401}); //Wrong email or password
        else{
          let user_id = res[0].id;
          let name = res[0].name;
          let iban = res[0].iban;
          token = jwt.sign({ user_id:  user_id}, secret);
          console.log("LOGIN SUCCESFUL. TOKEN = " + token);
          db.query("SELECT * FROM accounts WHERE user_id= ?;", user_id)
            .then(res =>{
              callback(null, {token: token, name:name, iban:iban, accounts: JSON.stringify(res)});
            }).catch(err => {
              callback(null, {errorCode: 400});
            }).catch(err => {
              callback(null, {errorCode: 400});
            });
        }
      });
  },

  Deposit: (call, callback) => {
    let currency = call.request.currency;
    let amount = call.request.amount;

    jwt.verify(call.request.token, secret, (err, decoded) => {
      if (err) callback(null, {errorCode: 402}); // Token error
      else{
        let user_id = decoded.user_id;
        // Search for an account with the given user and currency
        db.query("SELECT * FROM accounts WHERE user_id= ? AND currency= ?;", [user_id, currency])
          .then(res =>{
            let query;
            // If there is no account, create one
            if (res.length === 0){
              query = `INSERT INTO accounts SET user_id= ${user_id}, currency= '${currency}', balance= ${amount};`;
            }
            // If there is an account, update it
            else{
              let balance = parseFloat(res[0].balance) + amount;
              query = `UPDATE accounts SET balance = ${balance} WHERE user_id = ${user_id} and currency = '${currency}';`;
            }
            db.query(query)
              .then(res =>{
                // Recover updated list of accounts
                db.query("SELECT * FROM accounts WHERE user_id= ?;", user_id)
                  .then(res =>{
                    console.log("ACCOUNT (user_id = " + user_id +", currency = " + currency + "). DEPOSIT SUCCESFUL. ");
                    callback(null, {accounts: JSON.stringify(res)});
                  }).catch(err =>{
                    callback(null, {errorCode: 400});
                  });
              }).catch(err => {
                callback(null, {errorCode: 400});
              });
          }).catch(err => {
            callback(null, {errorCode: 400});
          });
        }
    });
  },

  Withdraw: (call, callback) => {
    let currency = call.request.currency;
    let amount =  call.request.amount;

    jwt.verify(call.request.token, secret, (err, decoded) => {
      if (err) callback(null, {errorCode: 402}); // Token error
      else{
        let user_id = decoded.user_id;
        // Get account from database
        db.query("SELECT balance FROM accounts WHERE user_id= ? AND currency= ?;", [user_id, currency])
          .then(res =>{
            if (res.length !== 0){
              let new_balance = res[0].balance - amount;
              // Update database if withdraw is possible
              if (new_balance >= 0){
                db.query("UPDATE accounts SET balance = ? WHERE user_id = ? and currency = ?;", [new_balance, user_id, currency])
                  .then(res =>{
                    // Recover updated list of accounts
                    db.query("SELECT * FROM accounts WHERE user_id= ?;", user_id)
                      .then(res =>{
                        console.log("ACCOUNT (user_id = " + user_id +", currency = " + currency + "). WITHDRAW SUCCESFUL. ");
                        callback(null, {accounts: JSON.stringify(res)});
                      }).catch(err =>{
                        callback(null, {errorCode: 400});
                      });
                  }).catch(err => {
                    callback(null, {errorCode: 400});
                  });
                }
                else callback(null, {errorCode: 401}); // Insuffcient balance
              }
              else callback(null, {errorCode: 400}); // Did not find account
          }).catch(err => {
            callback(null, {errorCode: 400});
          });
      }
    });
  },

  Buy: (call, callback) => {
    let amount = call.request.amount;
    let from = call.request.currencyFrom;
    let to = call.request.currencyTo;

    jwt.verify(call.request.token, secret, (err, decoded) => {
      if (err) callback(null, {code: 402}); // Token error
      else{
        let user_id = decoded.user_id;
        // Get source account
        db.query("SELECT * FROM accounts WHERE user_id= ? AND currency= ?;", [user_id, from])
          .then(res =>{
            if (res.length !== 0){
              let new_balance_from = parseFloat(res[0].balance) - parseFloat(amount);
              // Check if balance is sufficient
              if (new_balance_from >= 0){
                exch_service.Exchange({amount: amount, from: from, to: to})
                  .then(data => {
                    let conversion = data.value;
                    console.log("CONVERSION " , {err, data});
                    let transaction = { amount: amount, currency_from: from, currency_to: to, user_id: user_id};
                    // Get destination account, if it exists.
                    db.query("SELECT * FROM accounts WHERE user_id= ? AND currency= ?;", [user_id, to])
                      .then(res =>{
                        let query;
                        if (res.length !== 0){
                          // Update the existing destination account and make payment
                          let new_balance_to = parseFloat(res[0].balance) + parseFloat(conversion);
                          query = `UPDATE accounts SET balance = ${new_balance_to} WHERE user_id = ${user_id} and currency = '${to}';`
                        }
                        else{
                          // Create a new destination account with the new currency and make payment
                          query = `INSERT INTO accounts SET user_id= ${user_id}, currency= '${to}', balance= ${conversion}`
                        }
                        db.query(query)
                          .then(res => {
                                db.query("UPDATE accounts SET balance = ? WHERE user_id = ? and currency = ?;", [new_balance_from, user_id, from])
                                  .then(res => {
                                    db.query("INSERT INTO transactions SET ?;", transaction)
                                      .then(res => {
                                        // Recover updated list of accounts
                                        db.query("SELECT * FROM accounts WHERE user_id= ?;", user_id)
                                          .then(res =>{
                                            console.log("BUY user_id = " + user_id +" from = " + from + " to = " + to +" SUCCESFUL. ");
                                            callback(null, {accounts: JSON.stringify(res)});
                                          }).catch(err =>{
                                            console.log(err);
                                            callback(null, {errorCode: 400});
                                          });
                                      }).catch(err =>{
                                        console.log(err);
                                        callback(null, {errorCode: 400});
                                      });
                                  }).catch(err =>{
                                    console.log(err);
                                      callback(null, {errorCode: 400});
                                  });
                            }).catch(err =>{
                              console.log(err);
                              callback(null, {errorCode: 400});
                            });
                        }).catch(err =>{
                          console.log(err);
                          callback(null, {errorCode: 400});
                        });
                    }).catch(err =>{
                      console.log(err);
                      callback(null, {errorCode: 400}); // Error with exchange microservice
                    });
              }
              else callback(null, {errorCode: 401}); // Insuffcient balance
            }
            else callback(null, {errorCode: 400}); // Did not find account
          }).catch(err =>{
            console.log(err);
            callback(null, {errorCode: 400});
          });
      }
    });
  },

  ListTransactions : (call, callback) => {
    let filter = call.request.filter;

    jwt.verify(call.request.token, secret, (err, decoded) => {
      if (err) callback(null, {code: 402});
      else{
        let user_id = decoded.user_id;
        let query = "SELECT * FROM transactions WHERE user_id= " + user_id;
        let filter = JSON.parse(call.request.filter);

        query = filter.currency === "" ? query
                          : query + " AND (currency_from LIKE " + `'%${filter.currency}%'` + " OR currency_to LIKE " + `'%${filter.currency}%'` + ")";

        query = filter.dateFrom === "" ? query
                          : query + " AND trans_date >= " + `'${filter.dateFrom}'`;

        query = filter.dateTo === "" ? query
                          : query + " AND trans_date <= " + `'${filter.dateTo}'`;

        db.query(query)
          .then(res =>{
            console.log("LIST TRANSACTIONS user_id = " + user_id + " SUCCESFUL");
            callback(null, {transactions: JSON.stringify(res)});
          }).catch(err =>{
            console.log(err);
            callback(null, {errorCode: 400});
          });
      }
    });
  }
}

// Connection to exchange microservice
const exch_descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "/proto/exchange.proto")));
const exch_service = new exch_descriptor.exchange.ExchangeValue(`172.17.0.1:${EXCH_PORT}`, grpc.credentials.createInsecure());

// On Windows use host.docker.internal as IP instead

const users_descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "/proto/users.proto")));
const users = new grpc.Server();

exch_service.Exchange = promisify(exch_service.Exchange);
db.query = promisify(db.query);

users.addService(users_descriptor.users.UserMethods.service, implementations);
users.bindAsync(`0.0.0.0:${USERS_PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  users.start();
  console.log("grpc users server started on port %O", USERS_PORT);
});
