export class Transaction{
    id : string
    userId : string
    cryptoId : string
    cryptoName : string
    price : number
    quantity : number
    type : TransactionType
    status : Status 

    constructor(row : any){
        this.id = row.id
        this.userId = row.userid
        this.cryptoId = row.cryptoid
        this.cryptoName = row.cryptoname
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

export enum TransactionType{
    buy = 'buy', 
    sell = 'sell'
}