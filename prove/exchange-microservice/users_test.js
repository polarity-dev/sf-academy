const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { join } = require("path");
const { PORT = 9001 } = process.env;

const descriptor = grpc.loadPackageDefinition(protoLoader.loadSync(join(__dirname, "./proto/users.proto")));
const client = new descriptor.users.UserMethods(`0.0.0.0:${PORT}`, grpc.credentials.createInsecure());


client.Signup({email: 'grisendistefano@gmail.com', password: 'password', name: 'stefano', iban: 'WADASDASD'}, (err, data) => {
  console.log("SIGNUP: " , {err, data });
});

client.Login({email: 'grisendistefano@gmail.com', password: 'password'}, (err, data) => {
  console.log("LOGIN: " , {err, data });
});

client.Deposit({token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MjYzNTU2MzZ9.ARoD0Q_TnpYqO7INo1ig9bOQtw9XThyQoCJoChXxt9c',
      amount: 800.5, currency:'EUR'}, (err, data) => {
  console.log("DEPOSIT: " , {err, data });
});

client.Withdraw({token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MjYzNTU2MzZ9.ARoD0Q_TnpYqO7INo1ig9bOQtw9XThyQoCJoChXxt9c',
      amount: 400, currency:'EUR'}, (err, data) => {
  console.log("WITHDRAW: " , {err, data });
});

client.Buy({token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MjYzNTU2MzZ9.ARoD0Q_TnpYqO7INo1ig9bOQtw9XThyQoCJoChXxt9c',
      amount: 200, currencyFrom:'EUR', currencyTo:'JPY'}, (err, data) => {
  console.log("BUY: " , {err, data });
});

client.ListTransactions({token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MjYzNTU2MzZ9.ARoD0Q_TnpYqO7INo1ig9bOQtw9XThyQoCJoChXxt9c',
      filter: 0}, (err, data) => {
  console.log("LIST TRANSACTIONS: " , {err, data });
});
