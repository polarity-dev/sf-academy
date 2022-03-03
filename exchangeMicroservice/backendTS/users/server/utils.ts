export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  iban: string;
  saldo: number;
  balance_eur: number;
  balance_usd: number;
  balance: number;
}

export interface Transaction {
  id: number;
  user: number;
  value: number;
  currency: string;
  date: string;
  typeOperations: string;
}

export interface UserInfo {
  email?: string;
  id?: number;
  name?: string;
  iban?: string;
  balance_eur?: number;
  balance_usd?: number;
  balance?: number;
}

export type argCallError = null | Error;

export interface callReqOperations {
  value: number;
  symbol: string;
  id: number;
}

export interface callReqOperationsBuy {
  initialValue: number;
  value: number;
  symbol: string;
  id: number;
}
