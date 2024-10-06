export class Wallet{
    id : string
    userId : string
    cryptoId : string
    cryptoName : string
    quantity : number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(row : any){
        this.id = row.id
        this.userId = row.userid
        this.cryptoId = row.cryptoid
        this.cryptoName = row.cryptoname
        this.quantity = Number(row.quantity)
    }
}