interface User {
   userId: number;
   username: string;
   email: string;
   password: string;
   iban: string;
}

interface Transaction {
   transactionId: number;
   userId: number;
   timestamp: string;
   usdDelta: number;
   eurDelta: number;
}

export { User, Transaction }