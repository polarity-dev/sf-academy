
export interface User {
    id: number;
    username: string;
    saldo: number;
  }

export interface Crypto {
    id: number;
    name: string;
    symbol: string;
    price: number;
    price_updated_at: Date;
}
  
export interface TransactionQueue {
    id: number;
    user_id: number;
    crypto_id: number;
    crypto_amount: number;
    transaction_type: 'buy' | 'sell';
    price_at_transaction: number;
    transaction_final_value: number;
    status: 'pending' | 'completed' | 'failed';
    created_at: Date;
}

export interface CryptoParams {
    symbol: string;
}