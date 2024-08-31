import { Client } from "pg";
import { dbQuery } from "../database/dbQuery";
import crypto from "../models/cryptoModel";
import transaction from "../models/transactionModel";

function tdMaker(value: string,cssClass: string = "") {
    return `<td ${cssClass}>${value}</td>`;
}
export async function getCryptoHtml(db: Client) {
    const cryptos:Array<crypto> = await dbQuery(db,"select * from cryptos order by id;");
    var htmlRes = ``;
    for (const crypto of cryptos) {
        htmlRes += "<tr>";
        htmlRes += tdMaker(crypto.name.toString());
        htmlRes += tdMaker(crypto.symbol.toString());
        htmlRes += tdMaker(crypto.price.toString());
        htmlRes += tdMaker(crypto.owned.toString());
        htmlRes += "</tr>";
    }
    return htmlRes;
}
export async function getTransactionHtml(db: Client) {
    const transactions: Array<transaction> = await dbQuery(db,"select * from transactions order by date;");
    var htmlRes = ``;
    for (const transaction of transactions) {
        htmlRes += "<tr>";
        htmlRes += tdMaker(transaction.symbol.toString());
        htmlRes += tdMaker(transaction.quantity.toString());
        htmlRes += tdMaker(transaction.price.toString());
        htmlRes += tdMaker(transaction.date.toString());
        htmlRes += tdMaker(transaction.state.toString());
        htmlRes += "</tr>";
    }
    return htmlRes;
}
export async function getBudgetHtml(db: Client) {
    const response = await dbQuery(db,"select * from budget;");
    return response[0].budget.toString();
}