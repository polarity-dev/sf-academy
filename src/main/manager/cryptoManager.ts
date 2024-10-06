import { Crypto } from "../entity/crypto";
import { Status, Transaction, TransactionType } from "../entity/transaction";
import { User } from "../entity/user";
import { Wallet } from "../entity/wallet";
import { DbManager } from "./dbManager";

export class CryptoManager {
    
    private dbManager : DbManager

    constructor(){
        this.dbManager = new DbManager()
    }

    changeMarketValue(cryptoList : Crypto[]){
        const priceVariation = Number(process.env.PRICE_VARIATION) || 5
        for(const crypto of cryptoList){
            const addOrRemove = Math.floor(Math.random() * 11)

            if(addOrRemove % 2 === 0){
                crypto.price = Number((crypto.price + Math.random() * ((crypto.price*priceVariation)/100)).toFixed(2))
            } else {
                crypto.price = Number((crypto.price - Math.random() * ((crypto.price*priceVariation)/100)).toFixed(2))
            }
            
            this.dbManager.updateCrypto(crypto)
        }
        return cryptoList;
    }

    checkIfTransactionIsValid(t : Transaction, wallet : Wallet[], user : User, cryptoList : Crypto[]){
        if(t.type === TransactionType.sell){
            if(wallet.length === 0){ //se il wallet e' vuoto non posso vendere
                t.status = Status.failed
            } else {
                const x = wallet.findIndex( (x : Wallet) => x.cryptoId === t.cryptoId)
                if(x !== -1 && wallet[x].quantity >= t.quantity){
                    t.status = Status.completed
                } else {
                    t.status = Status.failed
                }
            }
        } else {
            const x = cryptoList.findIndex( (x : Crypto) => x.id === t.cryptoId)
            if(x !== -1 && cryptoList[x].quantity >= t.quantity){
                if(user.balance >= t.quantity * t.price){
                    t.status = Status.completed
                } else {
                    t.status = Status.failed
                } 
            } else {
                t.status = Status.failed
            }
        }
        return t
    }
   

}