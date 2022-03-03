import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
const clientGrpcUsers = require("./clientGrpcUsers");
const clientGrpcExchange = require("./clientGrpcExchange");
//Token
import * as Jwt from "njwt";
import crypto = require("crypto");
import { User } from "./utils";
import dotenv from 'dotenv'
dotenv.config()
const signingKey: Buffer = crypto.randomBytes(256);
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());


//middleware for token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenn = req.headers.authorization;

    if (tokenn) {
      const token = tokenn.split(" ")[1];

      const verifiedJwt = Jwt.verify(token, signingKey);

      if (verifiedJwt) {
        const id = verifiedJwt.body.toJSON().id;

        res.locals.id = id;

        next();
      }
    }
  } catch (e) {
    return res.status(401).send({ message: "Unauthorized", error: e });
  }
};

//microservice exchange
app.get("/exchange", (req: Request, res: Response) => {
  const params = req.query;

  if (!params.value || !params.currencyFrom || !params.currencyTo) {
    res.status(400).send({ message: "No info provided!" });
    return;
  }
  clientGrpcExchange.exchange(
    {
      value: params.value,
      currencyFrom: params.currencyFrom,
      currencyTo: params.currencyTo,
    },
    (err: null, data: any) => {
      if (err !== null) {
        res.status(400).send({ message: err });
        return;
      }
      res.status(200).send(data);
    }
  );
});

//microservice users
//methods POST
app.post("/users/signup", (req: Request, res: Response) => {
  const params = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    iban: req.body.iban,
  };

  if (!params.email || !params.password || !params.name || !params.iban) {
    res.status(400).send({ message: "No credentials provided!" });
    return;
  }
  clientGrpcUsers.signup(
    {
      email: params.email,
      password: params.password,
      name: params.name,
      iban: params.iban,
    },
    (error: any, data: any) => {
      if (error !== null) {
        res.status(400).send(error);
        return;
      }
      res.status(200).send(data);
    }
  );
});

app.post("/users/login", (req: Request, res: Response) => {
  const params = {
    email: req.body.email,
    password: req.body.password,
  };

  if (!params.email || !params.password) {
    res.status(400).send({ message: "No credentials provided!" });
    return;
  }
  clientGrpcUsers.login(
    {
      email: params.email,
      password: params.password,
    },
    (error: any, data: any) => {
      if (error !== null) {
        res.status(400).send(error);
        return;
      }

      const claims = {
        iss: "http://localhost:3000/", // The URL of your service
        id: data.id,
        name: data.name,
        iban: data.iban,
        saldoEUR: data.balanceEUR,
        saldoUSD: data.balanceUSD,
        balance: data.balance,
      };
      const jwt: Jwt.Jwt = Jwt.create(claims, signingKey);
      const token = jwt.compact();
      res.status(200).send({ token: token });
    }
  );
});

app.get("/users/auth", verifyToken, (req: Request, res: Response) => {
  const id = res.locals.id;
  if (!id) {
    res.status(400).send({ message: "No id  provided " });
    return;
  }

  clientGrpcUsers.userAuth({ id: id }, (error: any, data: User) => {
    if (error !== null) {
      res.status(400).send(error);
      return;
    }
    res.status(200).send(data);
  });
});

app.post("/users/deposit", verifyToken, (req: Request, res: Response) => {
  const params = {
    value: req.body.value,
    symbol: req.body.symbol,
    id: res.locals.id,
  };

  if (!params.symbol || !params.value || !params.id) {
    res.status(400).send({ message: "No symbol or value or id  provided  " });
    return;
  }

  clientGrpcUsers.deposit(
    {
      value: params.value,
      symbol: params.symbol,
      id: params.id,
    },
    (error: any, data: any) => {
      if (error !== null) {
        res.status(400).send(error);
        return;
      }

      res.status(200).send(data);
    }
  );
});

app.post("/users/withdraw", verifyToken, (req: Request, res: Response) => {
  const params = {
    value: req.body.value,
    symbol: req.body.symbol,
    id: res.locals.id,
  };

  if (!params.symbol || !params.value || !params.id) {
    res.status(400).send({ message: "No symbol or value or id  provided  " });
    return;
  }

  clientGrpcUsers.withdraw(
    {
      value: params.value,
      symbol: params.symbol,
      id: params.id,
    },
    (error: any, data: any) => {
      if (error !== null) {
        res.status(400).send(error);
        return;
      }
      console.log("withdraw data", data);
      res.sendStatus(200);
    }
  );
});

app.post("/users/buy", verifyToken, (req: Request, res: Response) => {
  const params = {
    initialValue: req.body.initialValue,
    value: req.body.value,
    symbol: req.body.symbol,
    id: res.locals.id,
  };

  if (!params.symbol || !params.value || !params.id) {
    res.status(400).send({ message: "No symbol or value or id  provided  " });
    return;
  }

  clientGrpcUsers.buy(
    {
      initialValue: params.initialValue,
      value: params.value,
      symbol: params.symbol,
      id: params.id,
    },
    (error: any, data: any) => {
      if (error !== null) {
        res.status(400).send(error);
        return;
      }
      res.sendStatus(200);
    }
  );
});

//methods GET
app.get(
  "/users/:id/transactions",
  verifyToken,
  (req: Request, res: Response) => {
    clientGrpcUsers.listTransactions(
      {
        userId: req.params.id,
      },
      (error: any, data: any) => {
        if (error !== null) {
          res.status(400).send(error);
          return;
        }

        res.status(200).send(data);
      }
    );
  }
);

app.get("/users/balance", verifyToken, (req: Request, res: Response) => {
  clientGrpcUsers.getBalance(
    {
      id: res.locals.id,
    },
    (error: any, data: any) => {
      if (error !== null) {
        res.status(400).send(error);
        return;
      }
      console.log("data", data);

      res.status(200).send(data);
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log(`Application listening at http://localhost:${process.env.PORT}`);
});
