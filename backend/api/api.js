require('dotenv').config();
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const express = require("express");
const bodyParser = require("body-parser");
const { initialize } = require("express-openapi");
const { join } = require("path");
const EXCH_PORT = process.env.EXCH_PORT;
const USERS_PORT = process.env.USERS_PORT;
const PORT = process.env.PORT;

const operations = {

  exchangeRates: (req, res, next) => {
    exch_service.ExchangeRates({},(err, data) => {
      if (err)
        return res.status(400).json({message: "exchange microservice error"});
      console.log("Exchange rates fetch succesful");
      res.json(data);
    });
  },

  login: (req, res, next) => {
    let info = {email: req.body.email, password: req.body.password}
    users_service.Login(info, (err, data) => {
      if (err)
        return res.status(400).json({message: "user microservice error"});
      if (data.hasOwnProperty("errorCode"))
        switch(data.errorCode){
          case 400:
            return res.status(400).json({message: "User microservice error"});
          case 401:
            return res.status(401).json({message: "Wrong email or password"});
          default:
            return res.status(400).json({message: "Unexpected error"});
        }
      console.log("Login succesful");
      res.json(data);
    });
  },

  signup: (req, res, next) => {
    let info = {email: req.body.email, password: req.body.password, name: req.body.name, iban: req.body.iban}
    users_service.Signup(info, (err, data) => {
      if (err)
        return res.status(400).json({message: "user microservice error"});
      if  (data.hasOwnProperty('errorCode'))
        switch(data.errorCode){
          case 401:
            return res.status(401).json({message: "Email already in use"});
          default:
            return res.status(400).json({message: "Unexpected error"});
        }
      console.log("Signup succesful");
      res.json(data);
    });
  },

  deposit: (req, res, next) => {
    let info = {token: req.body.token, currency: req.body.currency, amount: req.body.amount};
    users_service.Deposit(info, (err, data) => {
      if (err)
        return res.status(400).json({message: "user microservice error"});
      if  (data.hasOwnProperty('errorCode'))
        switch(data.errorCode){
          case 400:
            return res.status(400).json({message: "User microservice error"});
          case 402:
            return res.status(402).json({message: "Invalid token"});
          default:
            return res.status(400).json({message: "Unexpected error"});
        }
      console.log("deposit succesful");
      res.json(data);
    });
  },

  withdraw: (req, res, next) => {
    let info = {token: req.body.token, currency: req.body.currency, amount: req.body.amount};
    users_service.Withdraw(info, (err, data) => {
      if (err)
        return res.status(400).json({message: "user microservice error"});
      if  (data.hasOwnProperty('errorCode'))
        switch(data.errorCode){
          case 400:
            return res.status(400).json({message: "User microservice error"});
          case 401:
            return res.status(401).json({message: "Insuffcient balance"});
          case 402:
            return res.status(402).json({message: "Invalid token"});
          default:
            return res.status(400).json({message: "Unexpected error"});
        }
      console.log("deposit succesful");
      res.json(data);
    });
  },

  buy: (req, res, next) => {
    let info = {token: req.body.token, currencyFrom: req.body.currencyFrom, currencyTo: req.body.currencyTo, amount: req.body.amount};
    users_service.Buy(info, (err, data) => {
      if (err)
        return res.status(400).json({message: "user microservice error"});
      if  (data.hasOwnProperty('errorCode'))
        switch(data.errorCode){
          case 400:
            return res.status(400).json({message: "User microservice error"});
          case 401:
            return res.status(401).json({message: "Insuffcient balance"});
          case 402:
            return res.status(402).json({message: "Invalid token"});
          default:
            return res.status(400).json({message: "Unexpected error"});
        }
      console.log("buy succesful");
      res.json(data);
    });
  },

  listTransactions: (req, res, next) => {
    let info = {token: req.body.token, filter: req.body.filter};
    users_service.ListTransactions(info, (err, data) => {
      if (err)
        return res.status(400).json({message: "user microservice error"});
      if  (data.hasOwnProperty('errorCode'))
        switch(data.errorCode){
          case 400:
            return res.status(400).json({message: "User microservice error"});
          case 402:
            return res.status(402).json({message: "Invalid token"});
          default:
            return res.status(400).json({message: "Unexpected error"});
        }
      console.log("transactions list fetch");
      res.json(data);
    });
  }

}

const exch_descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "/proto/exchange.proto")));
const exch_service = new exch_descriptor.exchange.ExchangeValue(`172.17.0.1:${EXCH_PORT}`, grpc.credentials.createInsecure());

const users_descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "/proto/users.proto")));
const users_service = new users_descriptor.users.UserMethods(`172.17.0.1:${USERS_PORT}`, grpc.credentials.createInsecure());

// On Windows use host.docker.internal as IP instead

const app = express();
app.use(bodyParser.json());
app.use(function(req, res, next) {
  const allowedOrigins = ['http://localhost:3000', 'http://ec2-3-143-5-22.us-east-2.compute.amazonaws.com:3000', 'http://exchange-appl.s3-website.us-east-2.amazonaws.com'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
initialize({
  app,
  errorMiddleware: (err, req, res, next) => {
    res.json(err)
  },
  apiDoc: join(__dirname, "./apiDoc.yml"),
  dependencies: {
    log: console.log
  },
  operations
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
