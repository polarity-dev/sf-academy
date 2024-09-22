export class Crypto{
    id : string
    name : string
    price : string
    quantity : string
    

    constructor(row : any){
        this.id = row.id
        this.name = row.name
        this.price = row.price
        this.quantity = row.quantity
    }
}