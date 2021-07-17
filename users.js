const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { join } = require("path");
const mysql = require('mysql2');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const secret = 'shhhhh'
const EXCH_PORT = 9000;
const USERS_PORT = 9001;

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
  host: "localhost",
  user: "ste19",
  password: "admin",
  database: 'exchangedb',
});

// Connection to local database
db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database");
});

const implementations = {

  // Signup, Returns errorMessage and token
  Signup: (call, callback) => {
    let hash = call.request.password.hashCode();
    let user = { email: call.request.email, password: hash, name: call.request.name, iban: call.request.iban };

    db.query("INSERT INTO users SET ?;", user)
      .then(res => {
        let token = jwt.sign({ user_id: res.insertId }, secret);
        console.log("SIGNUP SUCCESFUL. TOKEN = " + token);
        callback(null, {token: token});
      }).catch(err => {
        callback(null, {errorMessage: "SQL ERROR: " + err});
      });
  },

  // Login, Returns errorMessage, token and list of accounts
  Login: (call, callback) => {
    let email = call.request.email
    let hash = call.request.password.hashCode();

    db.query("SELECT id FROM users WHERE email= ? AND password= ?;", [email, hash])
      .then(res =>{
        let user_id = res[0].id
        token = jwt.sign({ user_id:  user_id}, secret);
        console.log("LOGIN SUCCESFUL. TOKEN = " + token);
        db.query("SELECT * FROM accounts WHERE user_id= ?;", user_id)
          .then(res =>{
            callback(null, {token: token, accounts: JSON.stringify(res)});
          }).catch(err => {
            callback(null, {errorMessage: "SQL ERROR: " + err});
          });
      }).catch(err => {
        callback(null, {errorMessage: "SQL ERROR: " + err});
      });
  },

  // Deposit, Returns errorMessage
  Deposit: (call, callback) => {
    // Decode JWT token
    let currency = call.request.currency;
    let amount = call.request.amount;

    jwt.verify(call.request.token, secret, (err, decoded) => {
      if (err) callback(null, {errorMessage: "TOKEN ERROR"});
      else{
        let user_id = decoded.user_id;
        // Search for an account with the given user and currency
        db.query("SELECT * FROM accounts WHERE user_id= ? AND currency= ?;", [user_id, currency])
          .then(res =>{
            // If there is no account, create one
            if (res.length === 0){
              let account = { user_id: user_id, currency: currency, balance: amount };
              db.query("INSERT INTO accounts SET ?;", account)
              .then(res =>{
                console.log("ACCOUNT (user_id = " + user_id +", currency = " + currency + ") CREATED. DEPOSIT SUCCESFUL. ");
                callback(null, {});
              }).catch(err => {
                callback(null, {errorMessage: "SQL ERROR: " + err});
              });
            }
            // If there is an account, update it
            else{
              let balance = parseFloat(res[0].balance) + amount;
              db.query("UPDATE accounts SET balance = ? WHERE user_id = ? and currency = ?;", [balance, user_id, currency])
              .then(res => {
                console.log("ACCOUNT (user_id = " + user_id +", currency = " + currency + ") UPDATED. DEPOSIT SUCCESFUL. ");
                callback(null, {});
              }).catch(err => {
                callback(null, {errorMessage: "SQL ERROR: " + err});
              });
            }
          }).catch(err => {
            callback(null, {errorMessage: "SQL ERROR: " + err});
          });
        }
    });
  },

  // Withdraw, Returns errorMessage
  Withdraw: (call, callback) => {
    let currency = call.request.currency;
    let amount =  call.request.amount;

    jwt.verify(call.request.token, secret, (err, decoded) => {
      if (err) callback(null, {errorMessage: "TOKEN ERROR"});
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
                    console.log("ACCOUNT (user_id = " + user_id +", currency = " + currency + ") UPDATED. WITHDRAW SUCCESFUL. ");
                    callback(null, {});
                  }).catch(err => {
                    callback(null, {errorMessage: "SQL ERROR: " + err});
                  });
                }
                // Balance is not sufficient, return error
                else callback(null, {errorMessage: "INSUFFICIENT BALANCE"});
              }
              // User does not have an account with the given currency
              else callback(null, {errorMessage: "ACCOUNT DOES NOT EXIST"});
          }).catch(err => {
            callback(null, {errorMessage: "SQL ERROR: " + err});
          });
      }
    });
  },

  // Buy, Returns errorMessage
  Buy: (call, callback) => {
    let amount = call.request.amount;
    let from = call.request.currencyFrom;
    let to = call.request.currencyTo;

    jwt.verify(call.request.token, secret, (err, decoded) => {
      if (err) callback(null, {errorMessage: "TOKEN ERROR"});
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
                        // Update the existing destination account and make payment
                        if (res.length !== 0){
                          let new_balance_to = parseFloat(res[0].balance) + parseFloat(conversion);
                          db.query("UPDATE accounts SET balance = ? WHERE user_id = ? and currency = ?;", [new_balance_to, user_id, to])
                            .then(res => {
                              db.query("UPDATE accounts SET balance = ? WHERE user_id = ? and currency = ?;", [new_balance_from, user_id, from])
                                .then(res => {
                                  db.query("INSERT INTO transactions SET ?;", transaction)
                                    .then(res => {
                                      console.log("BUY user_id = " + user_id +" from = " + from + " to = " + to +" SUCCESFUL. ACCOUNT UPDATED");
                                      callback(null, {});
                                    }).catch(err =>{
                                      callback(null, {errorMessage: "SQL ERROR: " + err});
                                    });
                                  }).catch(err =>{
                                    callback(null, {errorMessage: "SQL ERROR: " + err});
                                  });
                              }).catch(err =>{
                                callback(null, {errorMessage: "SQL ERROR: " + err});
                              });
                        }
                        // Create a new destination account with the new currency and make payment
                        else{
                          let account = { user_id: user_id, currency: to, balance: conversion };
                          db.query("INSERT INTO accounts SET ?;", account)
                            .then(res =>{
                              db.query("UPDATE accounts SET balance = ? WHERE user_id = ? and currency = ?;", [new_balance_from, user_id, from])
                              .then(res =>{
                                db.query("INSERT INTO transactions SET ?;", transaction)
                                .then(res =>{
                                  console.log("BUY user_id = " + user_id +" from = " + from + " to = " + to +" SUCCESFUL. ACCOUNT CREATED");
                                  callback(null, {});
                                }).catch(err =>{
                                  callback(null, {errorMessage: "SQL ERROR: " + err});
                                });
                              }).catch(err =>{
                                callback(null, {errorMessage: "SQL ERROR: " + err});
                              });
                          }).catch(err =>{
                            callback(null, {errorMessage: "SQL ERROR: " + err});
                          });
                        }
                      }).catch(err =>{
                        callback(null, {errorMessage: "SQL ERROR: " + err});
                      });
                    });
                  }
                else callback(null, {errorMessage:"INSUFFICIENT BALANCE"});
              }
              else callback(null, {errorMessage:"ACCOUNT DOES NOT EXIST"});
          }).catch(err =>{
            callback(null, {errorMessage: "SQL ERROR: " + err});
          });
      }
    });
  },

  // ListTransactions, returns a list of transactions
  ListTransactions : (call, callback) => {
    let filter = call.request.filter;

    jwt.verify(call.request.token, secret, (err, decoded) => {
      if (err) callback(null, {errorMessage: "TOKEN ERROR"});
      else{
        let user_id = decoded.user_id;
        let query = "SELECT * FROM transactions WHERE user_id= " + user_id;
        switch(filter){
          // todo: add filters to query string
          default:
        }
        db.query(query)
          .then(res =>{
            console.log("LIST TRANSACTIONS user_id = " + user_id + " SUCCESFUL");
            callback(null, {token: token, transactions: JSON.stringify(res)});
          }).catch(err =>{
            callback(null, {errorMessage: "SQL ERROR: " + err});
          });
      }
    });
  }
}

// Connection to exchange microservice
const exch_descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "./proto/exchange.proto")));
const exch_service = new exch_descriptor.exchange.ExchangeValue(`0.0.0.0:${EXCH_PORT}`, grpc.credentials.createInsecure());

const users_descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "./proto/users.proto")));
const users = new grpc.Server();

exch_service.Exchange = promisify(exch_service.Exchange);
db.query = promisify(db.query);

users.addService(users_descriptor.users.UserMethods.service, implementations);
users.bindAsync(`0.0.0.0:${USERS_PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  users.start();
  console.log("grpc users server started on port %O", USERS_PORT);
});
