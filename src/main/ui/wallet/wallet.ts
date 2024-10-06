import { Wallet } from "../../entity/wallet"

export function getUserWallet(wallet : Wallet[]) : string{
    const html = /*html*/ `
    <div class='mb-5 sticky top-0 w-full bg-white p-5'>    
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
    <li class = 'h-10 flex border-y-1 border-gray-400'>
        <div>
            <label>Crypto</label>
            <p>${w.cryptoName}</p>
        </div>
        <div>
            <label>Quantità</label>
            <p>${w.quantity}</p>
        </div>
    </li>
    `
}