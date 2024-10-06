import { Transaction } from "../../entity/transaction"

export function getTrasactionTable(transactionList : Transaction[], tableType : string) : string{
    const html = /*html*/ `
    <div class='flex sticky top-0 w-full bg-white p-5'>    
        <button class='mr-3 border-b-2 ${tableType === 'table'?'border-black':'border-gray-300'} p-3 '
            hx-get="/show-transaction-table" hx-swap="innerHTML" hx-target="#transactionTable"
        >Coda</button>
        <button class='border-b-2 ${tableType === 'history'?'border-black':'border-gray-300'} p-3'
            hx-get="/show-transaction-history" hx-swap="innerHTML" hx-target="#transactionTable"
        >Cronologia</button>
    </div>
    <ul class="pt-3 pb-3 min-w-full bg-white text-center p-5">
        ${transactionList.map( (transaction) => getRow(transaction)).join('')}
    </table>
    `

    return html.replace(/(\r\n|\n|\r)/gm, ' ')
}


function getRow(transaction : Transaction) : string {
    return /*html*/`
    <li class ='h-10 flex border-b border-gray-300 grid grid-cols-5 items-center'>
        <div>
            ${transaction.cryptoName}
        </div>
        ${getType(transaction.type)}
        <div>
            ${transaction.quantity}
        </div>
        <div>
            ${transaction.price}€
        </div>
        ${getStatus(transaction.status)}

    </li>
    `
}

function getStatus(status : string){
    switch (status){
        case 'pending':
            return /*html*/`
                <div class='px-2 rounded-2xl bg-neutral-400 text-white'>
                    In attesa
                </div>
            `
        case 'completed':
            return /*html*/`
                <div class='px-2 rounded-2xl bg-green-400 text-white'>
                    Completato
                </div>
            `
        case 'failed':
            return /*html*/`
                <div class='px-2 rounded-2xl bg-red-500 text-white'>
                    Fallito
                </div>
            `
    }
}

function getType(type : string){
    switch (type){
        case 'buy':
            return /*html*/`
                <div class='px-2 w-1/2 rounded-2xl bg-green-400 text-white m-auto'>
                    Compra
                </div>
            `
        case 'sell':
            return /*html*/`
                <div class='px-2 w-1/2 rounded-2xl bg-red-500 text-white m-auto'>
                    Vendi
                </div>
            `
    }
}