import { Wallet } from "../../entity/wallet"

export function getUserWallet(wallet : Wallet[]) : string{
    const html = /*html*/ `
    <div class='sticky top-0 w-full bg-white p-5 pb-2'>    
        Wallet
    </div>
    <ul class="pt-3 pb-3 w-full bg-white p-5">
        ${wallet.map( (w) => getRow(w)).join('')}
    </ul>
    `

    return html.replace(/(\r\n|\n|\r)/gm, ' ')
}


function getRow(w : Wallet) : string {
    return /*html*/`
    <li class = 'h-10 flex border-b border-gray-300 grid grid-cols-2 items-center'>
        <div>
            ${w.cryptoName}
        </div>
        <div class='flex items-center'>
            <label class='text-gray-400 text-sm '>Quantità: </label>
            <p>${w.quantity}</p>
        </div>
    </li>
    `
}