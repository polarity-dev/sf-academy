export class User{
    id : string
    name : string
    balance : number
    

    constructor(row : any){
        this.id = row.id
        this.name = row.name
        this.balance = Number(row.balance)
    }
}