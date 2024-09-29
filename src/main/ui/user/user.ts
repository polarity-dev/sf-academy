import { User } from "../../entity/user"

export function getUser(user : User) : string{
    const html = /*html*/ `
         <p>Ciao ${user.name},</p>
         <p>Il tuo bilancio è di <span class='text-2xl'>${user.balance}</span> €</p> 
    `

    return html.replace(/(\r\n|\n|\r)/gm, ' ')
}