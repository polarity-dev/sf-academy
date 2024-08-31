export default class transaction {
    id: number;
    symbol: string;
    quantity: number;
    price: number;
    date: string; // the date logic is handled by the database
    state: string;
    constructor(id: number,symbol: string,quantity: number,price: number,date: string,state: string) {
        this.id = id;
        this.symbol = symbol;
        this.quantity = quantity;
        this.price = price;
        this.date = date;
        this.state = state;
    }
};