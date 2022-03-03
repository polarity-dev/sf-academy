export interface UserValue {
    email: string;
    password: string;
    name: string;
    iban: string;
}

export interface GetUser{
  email: string | null;
  name: string | null;
  iban: string | null;
  id:number | null;
  balanceEUR:number | null;
  balanceUSD:number | null;
}

export interface Transaction{
  id:number;
  value: number;
  date:string;
  typeOperations: string
  currency:string;
}

// Interfaces context
export interface InfoUser {
  id: number | null
  name: string|null
  email: string|null
  iban: string|null
  balanceEUR:number
  balanceUSD: number
  balance: number
}

export interface UserCotextProps{
  children: React.ReactNode
}

export enum FormVariant{
  DEPOSIT="DEPOSIT", 
  WITHDRAW="WITHDRAW"
}



export type SortKeys = keyof Transaction;