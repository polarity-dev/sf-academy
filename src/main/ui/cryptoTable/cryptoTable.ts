import { Crypto } from "../../entity/crypto"

export function getCryptoTable(cryptoList : Crypto[]) : string{
    const html = /*html*/ `
    <table class="pt-3 pb-3 min-w-full bg-white text-center">
        <thead>
            <tr>
                <th>Crypto</th>
                <th>Quantità</th>
                <th>Prezzo</th>
            </tr>
        </thead>
        <tbody>
            ${cryptoList.map( (crypto) => getRow(crypto)).join('')}
        </tbody>
    </table>
    `

    return html.replace(/(\r\n|\n|\r)/gm, ' ')
}

function getRow(crypto : Crypto) : string {
    return /*html*/`
    <tr class = 'cursor-pointer'>
        <td class="hidden" id="${crypto.name}${crypto.id}">${crypto.id}</td>
        <td>${crypto.name}</td>
        <td>${crypto.quantity}</td>
        <td>${crypto.price}</td>
    </tr>
    `
}