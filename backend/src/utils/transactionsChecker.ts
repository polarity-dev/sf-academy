import { Client } from "pg";
import crypto from "../models/cryptoModel";
import { dbQuery } from "../database/dbQuery";

// this function expects symbol and action to be actual strings, while quantity should be a number
export async function checkTransaction(db: Client,symbol: string,action: string,quantity: number): Promise<crypto | string> { 
    if (quantity <= 0) {
        return "insert positive quantity";
    }
    if (action != "buy" && action != "sell") {
        return "insert valid action (buy or sell)";
    }
    const response = await dbQuery(db,"select * from cryptos where symbol = $1",[symbol]);
    if (response.length == 0) {
        return `the crypto ${symbol} does not exist :(`;
    }
    return response[0];
}