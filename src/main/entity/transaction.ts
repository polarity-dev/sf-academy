export class Transaction{
    id : string
    userId : string
    cryptoId : string
    cryptoName : string
    price : number
    quantity : number
    type : string
    status : Status 

    constructor(row : any){
        this.id = row.id
        this.userId = row.userId
        this.cryptoId = row.cryptoId
        this.cryptoName = row.cryptoName
        this.type = row.type
        this.status = row.status
        this.price = Number(row.price)
        this.quantity = Number(row.quantity)
    }
}

export enum Status{
    pending = 'pending', 
    completed = 'completed', 
    failed = 'failed'
}