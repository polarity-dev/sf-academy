import { Client } from "pg";
import crypto from "../models/cryptoModel";
import transaction from "../models/transactionModel";
import { getTable } from "../database/dbQueries";

function tdMaker(value: string,cssClass: string = "") {
    return `<td ${cssClass}>${value}</td>`;
}

export async function getCryptoHtml(db: Client) {
    const response = await getTable(db,"cryptos","id");
    if (response.success && response.data) { 
        const cryptos:Array<crypto> = response.data;
        var htmlRes = ``;
        for (const crypto of cryptos) {
            htmlRes += "<tr>";
            htmlRes += tdMaker(crypto.name.toString());
            htmlRes += tdMaker(crypto.symbol.toString());
            htmlRes += tdMaker(crypto.price.toString());
            htmlRes += tdMaker(crypto.owned.toString());
            htmlRes += "</tr>";
        }
        return { success: true, data: htmlRes }; 
    } else {
        return { success: false }; 
    }
}

export async function getTransactionHtml(db: Client) {
    const response = await getTable(db,"transactions","date desc");
    if (response.success && response.data) { 
        const transactions: Array<transaction> = response.data;
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
        return { success: true, data: htmlRes }; 
    } else {
        return { success: false };
    }
}

export async function getBudgetHtml(db: Client) {
    const response = await getTable(db,"budget","budget");
    
    if (response.success && response.data) {
        const budget:number = response.data[0].budget;
        return { success: true, budget: budget.toString() };
    } else {
        return { success: false };
    }

}