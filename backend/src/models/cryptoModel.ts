export default class crypto {
    id: number;
    name: string;
    symbol: string;
    price: number;
    owned: number;
    constructor(id: number,name: string,symbol: string,price: number,owned: number) {
        this.id = id;
        this.name = name;
        this.symbol = symbol;
        this.price = price;
        this.owned = owned;
    };
};