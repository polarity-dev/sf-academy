import { Crypto } from "../../entity/crypto"

export function getTrasactionForm(cryptoList : Crypto[]) : string{
    const html = /*html*/ `       
        <form>
            <div id='selected'>Seleziona una crypto</div>
            <select 
                class='mb-3 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'
                name='crypto'
            >
                <option></option>
                ${cryptoList.map((crypto) => getOption(crypto)).join('')}
            </select>
            <div id='selected'>Quantità</div>
            <input 
                class='mb-3 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400' 
                type='number' 
                name='quantity'
            />
            <div class='w-full flex items-center'>
                <button hx-post="/sell" class='ml-auto mr-3 px-3 py-2 w-20 rounded-2xl bg-red-500 text-white' hx-swap="innerHTML" hx-target="#transactionForm">Vendi</button>
                <button hx-post="/buy" class='px-3 py-2 w-20 rounded-2xl bg-green-400 text-white' hx-swap="innerHTML" hx-target="#transactionForm">Compra</button>
            </div>
        </form>
    `

    return html.replace(/(\r\n|\n|\r)/gm, ' ')
}

function getOption(crypto : Crypto) : string {
    return /*html*/`
        <option value='${crypto.id}'>${crypto.name}</option>
    `
}