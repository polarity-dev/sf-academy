import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { InfoUser } from "../utils/Interfaces";

type UserCotextProps = { children: React.ReactNode };

const User = createContext<
  | {
      token: string | null;
      user: InfoUser;
      handleSetUser: (user: InfoUser) => void;
      getBalance: () => Promise<void>;
      handleSetToken: (token: string | null) => void;
    }
  | undefined
>(undefined);

const UserContext = ({ children }: UserCotextProps) => {
  const [user, setUser] = useState<InfoUser>({
    id: null,
    name: null,
    email: null,
    iban: null,
    balanceEUR: 0,
    balanceUSD: 0,
    balance:0
  });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    
    if (token) {
      setToken(token);
    }
  }, []);

  const getBalance = async () => {
    try {
      if (token && user) {
        const res = await api.balance(token);
        setUser({
          ...user,
          balanceUSD: res.data.balanceUSD,
          balanceEUR: res.data.balanceEUR,
          balance:res.data.balance
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSetUser = (user: InfoUser) => {
    setUser(user);
  };

  const handleSetToken = (token: string | null) => {
    setToken(token);
  };

  return (
    <User.Provider
      value={{
        token,
        user,
        handleSetUser,
        getBalance,
        handleSetToken,
      }}
    >
      {children}
    </User.Provider>
  );
};

export const UserState = () => {
  const context = useContext(User);
  if (context === undefined) {
    throw Error("Context deve essere usato dentro User.Provider");
  }
  return context;
};

export default UserContext;
