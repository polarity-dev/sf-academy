import { User } from "../../entity/user"

export function getUser(user : User) : string{
    const html = /*html*/ `
         <p>Ciao ${user.name}, il tuo bilancio è di <span class='text-2xl' hx-ext="sse" sse-connect="/balance" sse-swap="message">${user.balance}</span> €</p> 
    `

    return html.replace(/(\r\n|\n|\r)/gm, ' ')
}