import { getTrasactionForm } from "./transactionForm/transactionForm";
import { Crypto } from "../entity/crypto";
import { getUserSection } from "./user/user";

export function getMainPage (cryptoList : Crypto[]) : string{
    return /*html*/`
    <!doctype html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://unpkg.com/htmx.org@1.9.12"></script>
            <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/sse.js"></script>
        </head>
        <body>
    
            <div class='p-3 grid grid-cols-3'>
                <div class='p-5 m-3 border border-gray-300 rounded-2xl col-span-2' hx-ext="sse" sse-connect="/crypto-list" sse-swap="message"> 
                    
                </div>
                <div>
                    <div class='p-5 m-3 border border-gray-300 rounded-2xl flex flex-col'>
                        ${getTrasactionForm(cryptoList)}
                    </div>
                    <div class='p-5 m-3 border border-gray-300 rounded-2xl flex flex-col'>
                        ${getUserSection()}
                    </div>
                </div>
            </div>
        </body>
    </html>      
    `
}