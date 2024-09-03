import { FastifyRequest } from "fastify";
import transactionValidator from "../models/transactionJSONSchema";
import { Client } from "pg";
import crypto from "../models/cryptoModel";
import { dbQuery } from "../database/dbQueries";

export async function checkTransaction(request: FastifyRequest,db: Client) {
    if (!transactionValidator(request.body)) { // used to check whether the body has the required fields
        if (transactionValidator.errors != undefined && transactionValidator.errors[0].message != undefined) {
            return { success: false, error: transactionValidator.errors[0].message };
        } else {
            return { success: false, error: "Error detected in input format but no error message showed up" };
        }
    } else {
        let { symbol, action, quantity = "1" } = request.body as { symbol: string, action: string, quantity: string };
        symbol = symbol.trim();
        action = action.trim();
        quantity = quantity.trim();
        if (quantity == "") {
            quantity = "1"; // default value
        }
        if (action != "buy" && action != "sell") {
            return { success: false, error: "Insert a valid action (buy or sell)" };
        } else if (isNaN(+quantity) || +quantity <= 0) {
            return { success: false, error: "Insert a positive numeric value" };
        } else {
            const response = await dbQuery(db,"select * from cryptos where symbol = $1;",[symbol]);
            if (response.success && response.data) {
                const data = response.data;
                if (data.length == 0) {
                    return { success: false, error: `The crypto ${symbol} does not exist :(` };
                } else {
                    const crypto:crypto = data[0];
                    return { success: true, crypto: crypto, quantity: (action == "buy" ? Number(quantity) : - Number(quantity)) };
                }
            } else {
                return { success: false, error: `There was a database error while searching for the crypto ${symbol}` };
            }
        }
    }
}