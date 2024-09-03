import { FastifyReply, FastifyRequest } from "fastify";
import transactionValidator from "../models/transactionJSONSchema";
import { Client } from "pg";
import crypto from "../models/cryptoModel";
import { SSEManager } from "@soluzioni-futura/sse-manager";
import { handleTransaction } from "./transactionsHandler";

// should design this better: 
// something like
// you query whether the request is good. if it is, return the crypto and the quantity so that you can call insert
// otherwise, you stop
export async function checkTransaction(request: FastifyRequest,reply: FastifyReply,SSEManager: SSEManager,db: Client) {
    if (!transactionValidator(request.body)) { // used to check whether the body has the required fields
        if (transactionValidator.errors != null && transactionValidator.errors != undefined) {
            reply.send(transactionValidator.errors[0].message);
        } else {
            console.log("Error: Error detected in input format but no error message showed up: ", request.body);
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
            reply.send("Insert a valid action (buy or sell)");
        } else if (isNaN(+quantity) || +quantity <= 0) {
            reply.send("Insert a positive numeric value");
        } else {
            try {
                const response = (await db.query("select * from cryptos where symbol = $1;",[symbol])).rows;
                if (response.length == 0) {
                    reply.send(`The crypto ${symbol} does not exist :(`);
                } else {
                    const crypto:crypto = response[0];
                    reply.send(await handleTransaction(SSEManager,db,crypto,(action == "buy" ? Number(quantity) : - Number(quantity))));
                }
            } catch (error) {
                console.error(`There was an error while searching for the crypto ${symbol}: `, error);
                process.exit(1);
            }
        }
    }
}