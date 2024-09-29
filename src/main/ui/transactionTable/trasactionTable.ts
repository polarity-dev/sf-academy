import { Transaction } from "../../entity/transaction"

export function getTrasactionTable(transactionList : Transaction[]) : string{
    console.log(transactionList)
    const html = /*html*/ `
    <table class="pt-3 pb-3 min-w-full bg-white text-center">
        <thead>
            <tr>
                <th>Crypto</th>
                <th>Tipo di transazione</th>
                <th>Quantità</th>
                <th>Prezzo</th>
                <th>Stato</th>
            </tr>
        </thead>
        <tbody>
            ${transactionList.map( (transaction) => getRow(transaction)).join('')}
        </tbody>
    </table>
    `

    return html.replace(/(\r\n|\n|\r)/gm, ' ')
}


function getRow(transaction : Transaction) : string {
    return /*html*/`
    <tr class = 'h-10'>
        <td>${transaction.cryptoName}</td>
        <td>${transaction.type}</td>
        <td>${transaction.quantity}</td>
        <td>${transaction.price}</td>
        <td>${transaction.status}</td>
    </tr>
    `
}