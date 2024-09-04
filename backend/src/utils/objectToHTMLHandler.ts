import { Client } from "pg";
import crypto from "../models/cryptoModel";
import transaction from "../models/transactionModel";
import { getTable } from "../database/dbQueries";

function tdMaker(value: string,cssClass: string = "") {
    return `<td class="${cssClass}">${value}</td>`;
}

export async function getCryptoHtml(db: Client) {
    const response = await getTable(db,"cryptos","id");
    if (response.success && response.data) { 
        const cryptos:Array<crypto> = response.data;
        var htmlRes = ``;
        for (const crypto of cryptos) {
            htmlRes += "<tr>";
            htmlRes += tdMaker(crypto.name.toString(),"text-center");
            htmlRes += tdMaker(crypto.symbol.toString(),"text-center");
            htmlRes += tdMaker(crypto.price.toString(),"text-center");
            htmlRes += tdMaker(crypto.owned.toString(),"text-center");
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
            htmlRes += tdMaker(transaction.symbol.toString(),"text-center");
            htmlRes += tdMaker(transaction.quantity.toString(),"text-center");
            htmlRes += tdMaker(transaction.price.toString(),"text-center");
            htmlRes += tdMaker(transaction.date.toString(),"text-center");
            const state = transaction.state.toString();
            if (state == "pending") {
                htmlRes += tdMaker(state,"text-center");
            } else if (state == "success") {
                htmlRes += tdMaker(state,"text-green-500" + " " + "text-center");
            } else {
                htmlRes += tdMaker(state,"text-red-500" + " " + "text-center");
            }
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
        return { success: true, data: budget.toFixed(2).toString() };
    } else {
        return { success: false };
    }

}