const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { join } = require("path");
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const secret = 'shhhhh'
const { PORT = 9001 } = process.env;

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
  database: 'exchangedb'
});

// Connection to local database
db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database");
});

const implementations = {
  // Signup method. Returns code (error or not) and token
  // code 100 ==> OK; != 500 ==> not OK!
  Signup: (call, callback) => {
    hash = call.request.password.hashCode();
    let user = { email: call.request.email, password: hash, name: call.request.name, iban: call.request.iban };
    db.query("INSERT INTO users SET ?;", user, (err, res) => {
      if(err) {
        console.log("SIGNUP ERROR. " + err.sqlMessage);
        callback(null, {code: 500});
      }
      else{
        token = jwt.sign({ user_id: res.insertId }, secret);
        console.log("SIGNUP SUCCESFUL. TOKEN = " + token);
        callback(null, {code: 100, token: token});
      }
    });
  },
  // Login method. Returns code and token
  Login: (call, callback) => {
    hash = call.request.password.hashCode();
    db.query("SELECT id FROM users WHERE email= ? AND password= ?;", [call.request.email, hash] ,(err, res) => {
      if(err) {
        console.log("LOGIN ERROR. " + err.sqlMessage);
        callback(null, {code: 500});
      }
      else{
        token = jwt.sign({ user_id: res[0].id }, secret);
        console.log("LOGIN SUCCESFUL. TOKEN = " + token);
        callback(null, {code: 100, token: token});
      }
    });
  },
  // Deposit method. Returns code
  Deposit: (call, callback) => {
    // Decode JWT token
    jwt.verify(call.request.token, secret, (err, decoded) => {
      if (err) {
        console.log("DEPOSIT ERROR. " + err);
        callback(null, {code: 500});
      }
      else{
        let user_id = decoded.user_id;
        // Search for an account with the given user and currency
        db.query("SELECT * FROM accounts WHERE user_id= ? AND currency= ?;", [user_id, call.request.currency], (err, res) => {
          if(err) {
            console.log("DEPOSIT ERROR. " + err.sqlMessage);
            callback(null, {code: 500});
          }
          else{
            // If there is no account, create one
            if (res.length === 0){
              let account = { user_id: user_id, currency: call.request.currency, balance: call.request.amount };
              db.query("INSERT INTO accounts SET ?;", account, (err, res) => {
                if(err) {
                  console.log("DEPOSIT ERROR. " + err.sqlMessage);
                  callback(null, {code: 500});
                }
                else{
                  console.log("ACCOUNT CREATED. DEPOSIT SUCCESFUL. ");
                  callback(null, {code: 100});
                }
              });
            }
            // If there is an account, update it
            else{
              let balance = parseFloat(res[0].balance) + call.request.amount;
              db.query("UPDATE accounts SET balance = ? WHERE user_id = ? and currency = ?;", [balance, user_id, call.request.currency], (err, res) => {
                if(err) {
                  console.log("DEPOSIT ERROR. " + err.sqlMessage);
                  callback(null, {code: 500});
                }
                else{
                  console.log("ACCOUNT UPDATED. DEPOSIT SUCCESFUL. ");
                  callback(null, {code: 100});
                }
              });
            }
          }
        });
      }
    });
  }
}

const descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "./proto/users.proto")));
const server = new grpc.Server();

server.addService(descriptor.users.UserMethods.service, implementations);
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log("grpc users server started on port %O", PORT);
});
