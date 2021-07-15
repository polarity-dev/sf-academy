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
      amount: 800.5, currency:'USD'}, (err, data) => {
  console.log("DEPOSIT: " , {err, data });
});
