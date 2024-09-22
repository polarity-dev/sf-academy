export class Crypto{
    id : string
    name : string
    price : number
    quantity : number
    

    constructor(row : any){
        this.id = row.id
        this.name = row.name
        this.price = Number(row.price)
        this.quantity = Number(row.quantity)
    }
}