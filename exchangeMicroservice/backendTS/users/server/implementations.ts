import bcrypt from "bcrypt";
import {
  User,
  Transaction,
  argCallError,
  callReqOperations,
  callReqOperationsBuy,
  UserInfo,
} from "./utils";
//import file for db connect
import knex from "../db/db";

export const implementations = {
  signup: (
    call: {
      request: { email: string; password: string; name: string; iban: string };
    },
    callback: (arg0: argCallError, arg1: { message?: string }) => void
  ) => {
    knex("users")
      .insert({
        email: call.request.email,
        password: bcrypt.hashSync(call.request.password, 10),
        name: call.request.name,
        iban: call.request.iban,
        balance: Math.floor(Math.random() * 1500) + 100, //genero un numero che va da 100 a 15000 per simulare un saldo IBAN,
        balance_eur: 0,
        balance_usd: 0,
      })
      .then(() => {
        callback(null, { message: "successfull signup" });
      })
      .catch((err: Error) => callback(err, {}));
  },
  login: (
    call: {
      request: { email: string; password: string };
    },
    callback: (arg0: argCallError, arg1: UserInfo) => void
  ) => {
    const userInfo = {
      email: call.request.email,
      password: call.request.password,
    };

    knex
      .select("*")
      .from("users")
      .where("email", userInfo.email)
      .then((res: User[]) => {
        //Verifico password hashata
        const pass = bcrypt.compareSync(userInfo.password, res[0].password);

        if (pass) {
          const user = {
            email: res[0].email,
            id: res[0].id,
            name: res[0].name,
            iban: res[0].iban,
            balanceEUR: res[0].balance_eur,
            balanceUSD: res[0].balance_usd,
            balance: res[0].balance
          };
          callback(null, user);
        } else {
          callback(new Error("Error credential"), {});
        }
      })
      .catch((err: Error) => {
        callback(err, {});
      });
  },
  deposit: (
    call: { request: callReqOperations },
    callback: (arg0: argCallError, arg1: { message?: string }) => void
  ) => {
    const infoDeposit = {
      value: call.request.value,
      symbol: call.request.symbol,
      id: call.request.id,
    };

    if (infoDeposit.symbol === "$") {
      knex
        .select("balance", "balance_usd")
        .from("users")
        .where("id", infoDeposit.id)
        .then((res: any) => {
          if (res[0].balance < infoDeposit.value || infoDeposit.value < 0) {
            callback(new Error("Operations not allowed"), {});
            return
          }
          knex
            .select("balance", "balance_usd")
            .from("users")
            .where("id", infoDeposit.id)
            .decrement("balance", infoDeposit.value)
            .increment("balance_usd", infoDeposit.value)
            .then(() => {
              knex("transactions")
                .insert({
                  user_id: infoDeposit.id,
                  typeOperations: "deposit",
                  value: infoDeposit.value,
                  currency: infoDeposit.symbol,
                  date: new Date(),
                })
                .then(() => {
                  callback(null, { message: "deposito effettuato" });
                })
                .catch((err: Error) => callback(err, {}));
            })
            .catch((e:Error) => callback(e, {}));
        })
        .catch((e:Error) => callback(e, {}));
    } else if (infoDeposit.symbol === "€") {
      knex
        .select("balance", "balance_eur")
        .from("users")
        .where("id", infoDeposit.id)
        .then((res: any) => {
          if (res[0].balance < infoDeposit.value || infoDeposit.value < 0) {
            callback(new Error("Operations not allowed"), {});
            return
          }
          knex
            .select("balance", "balance_eur")
            .from("users")
            .where("id", infoDeposit.id)
            .decrement("balance", infoDeposit.value)
            .increment("balance_eur", infoDeposit.value)
            .then(() => {
              knex("transactions")
                .insert({
                  user_id: infoDeposit.id,
                  typeOperations: "deposit",
                  value: infoDeposit.value,
                  currency: infoDeposit.symbol,
                  date: new Date(),
                })
                .then(() => {
                  callback(null, { message: "deposito effettuato" });
                })
                .catch((err: Error) => callback(err, {}));
            })
            .catch((e:Error) => callback(e, {}));
        })
        .catch((e:Error) => callback(e, {}));
    }
  },
  withdraw: (
    call: { request: callReqOperations },
    callback: (arg0: argCallError, arg1: { message?: string }) => void
  ) => {
    const infoWithDraw = {
      value: call.request.value,
      symbol: call.request.symbol,
      id: call.request.id,
    };

    if (infoWithDraw.symbol === "$") {
      knex
        .select("balance", "balance_usd")
        .from("users")
        .where("id", infoWithDraw.id)
        .increment("balance", infoWithDraw.value)
        .decrement("balance_usd", infoWithDraw.value)
        .then(() => {
          knex("transactions")
            .insert({
              user_id: infoWithDraw.id,
              typeOperations: "withdraw",
              value: infoWithDraw.value,
              currency: infoWithDraw.symbol,
              date: new Date(),
            })
            .then(() => {
              callback(null, { message: "withdraw effettuato" });
            })
            .catch((err: Error) => callback(err, {}));
        })
        .catch((err: Error) => callback(err, {}));
    } else if (infoWithDraw.symbol === "€") {
      knex
        .select("balance", "balance_eur")
        .from("users")
        .where("id", infoWithDraw.id)
        .increment("balance", infoWithDraw.value)
        .decrement("balance_eur", infoWithDraw.value)
        .then(() => {
          knex("transactions")
            .insert({
              user_id: infoWithDraw.id,
              typeOperations: "withdraw",
              value: infoWithDraw.value,
              currency: infoWithDraw.symbol,
              date: new Date(),
            })
            .then(() => {
              callback(null, { message: "withdraw effettuato" });
            })
            .catch((err: Error) => callback(err, {}));
        })
        .catch((err: Error) => callback(err, {}));
    }
  },
  buy: (
    call: { request: callReqOperationsBuy },
    callback: (arg0: argCallError, arg1: { message?: string }) => void
  ) => {
    const infobuy = {
      initialValue: call.request.initialValue,
      value: call.request.value,
      symbol: call.request.symbol,
      id: call.request.id,
    };

    if (infobuy.symbol === "$") {
      knex
        .select("balance_eur", "balance_usd")
        .from("users")
        .where("id", infobuy.id)
        .increment({
          balance_usd: infobuy.value,
        })
        .decrement({
          balance_eur: infobuy.initialValue,
        })
        .then(() => {
          knex("transactions")
            .insert({
              user_id: infobuy.id,
              typeOperations: "buy",
              value: infobuy.value,
              currency: infobuy.symbol,
              date: new Date(),
            })
            .then(() => callback(null, { message: "buy effettuato" }))
            .catch((err: Error) => callback(err, {}));
        })
        .catch((err: Error) => callback(err, {}));
    } else if (infobuy.symbol === "€") {
      knex
        .select("balance_eur", "balance_usd")
        .from("users")
        .where("id", infobuy.id)
        .increment({
          balance_eur: infobuy.value,
        })
        .decrement({
          balance_usd: infobuy.initialValue,
        })
        .then(() => {
          knex("transactions")
            .insert({
              user_id: infobuy.id,
              typeOperations: "buy",
              value: infobuy.value,
              currency: infobuy.symbol,
              date: new Date(),
            })
            .then(() => callback(null, { message: "buy effettuato" }))
            .catch((err: Error) => callback(err, {}));
        });
    }
  },
  listTransactions: (
    call: { request: { userId: string } },
    callback: (arg0: argCallError, arg1: { list?: Transaction[] }) => void
  ) => {
    knex("transactions")
      .where("user_id", call.request.userId)
      .then((data: Transaction[]) => {
        if (data) {
          callback(null, { list: data });
        } else {
          callback(new Error("Not found user transactions!"), {});
        }
      })
      .catch((err: Error) => {
        callback(err, {});
      });
  },
  userAuth: (
    call: { request: { id: string } },
    callback: (arg0: argCallError, arg1: UserInfo) => void
  ) => {
    knex("users")
      .where("id", call.request.id)
      .then((res: User[]) => {
        const user = {
          email: res[0].email,
          id: res[0].id,
          name: res[0].name,
          iban: res[0].iban,
          balanceEUR: res[0].balance_eur,
          balanceUSD: res[0].balance_usd,
          balance: res[0].balance
        };
        if (res) {
          callback(null, user);
        } else {
          callback(new Error("Not found user transactions!"), {});
        }
      })
      .catch((err: Error) => {
        callback(err, {});
      });
  },
  getBalance: (
    call: { request: { id: string | number } },
    callback: (
      arg0: argCallError,
      arg1: { balanceEUR?: number; balanceUSD?: number, balance?:number }
    ) => void
  ) => {
    const id = call.request.id;
    knex
      .select("balance_usd", "balance_eur","balance")
      .from("users")
      .where("id", id)
      .then((res: any) => {
        callback(null, {
          balanceEUR: res[0].balance_eur,
          balanceUSD: res[0].balance_usd,
          balance: res[0].balance
        });
      })
      .catch((err: Error) => {
        callback(err, {});
      });
  },
};
