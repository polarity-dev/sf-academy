export interface User {
  email: string;
  id: number;
  name: string;
  iban: string;
  saldoEUR: number;
  saldoUSD: number;
}

export interface Transaction {
  id: number;
  user: number;
  value: number;
  currency: string;
  date: string;
  typeOperation: string;
}
