export class User{
    id : string
    name : string
    balance : number
    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(row : any){
        console.log(row.balance)
        this.id = row.id
        this.name = row.name
        this.balance = Number(row.balance)
    }
}