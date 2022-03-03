import axios from "axios";

const axiosIstance = axios.create({
  headers: {
    "Content-type": "application/json",
  },
});

const api = {
  login: (email: string, password: string) => {
    return axiosIstance.post("/users/login", {
      email: email,
      password: password,
    });
  },
  signup: (email: string, password: string, name: string, iban: string) => {
    return axiosIstance.post("users/signup", {
      email: email,
      password: password,
      name: name,
      iban: iban,
    });
  },
  balance: (token: string) => {
    return axiosIstance.get("/users/balance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  transactions: (id: number, token: string) => {
    return axiosIstance.get(`/users/${id}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  authUser: (token: string) => {
    return axiosIstance.get(`/users/auth`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  exchange: (value: number, currencyFrom: string, currencyTo: string) => {
    return axiosIstance.get("/exchange",{ params: {  value: value,
      currencyFrom: currencyFrom,
      currencyTo: currencyTo, } });
  },
  buy: (initialValue: number, value: number, symbol: string, token: string) => {
    return axiosIstance.post(
      `/users/buy`,
      {
        initialValue: initialValue,
        value: value,
        symbol: symbol,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  deposit: (value: number, symbol: string, token: string) => {
    return axiosIstance.post(
      `/users/deposit`,
      {
        value: value,
        symbol: symbol,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  withdraw: (value: number, symbol: string, token: string) => {
    return axiosIstance.post(
      `/users/withdraw`,
      {
        value: value,
        symbol: symbol,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};

export default api;
