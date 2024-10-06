export class Crypto{
    id : string
    name : string
    price : number
    quantity : number
    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(row : any){
        this.id = row.id
        this.name = row.name
        this.price = Number(row.price)
        this.quantity = Number(row.quantity)
    }
}