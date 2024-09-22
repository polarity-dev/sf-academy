import { Crypto } from "../entity/crypto";
import { DbManager } from "./dbManager";

export class CryptoManager {
    
    dbManager = new DbManager()

    changeMarketValue(cryptoList : Crypto[]){
        const priceVariation = Number(process.env.PRICE_VARIATION) || 5
        for(let crypto of cryptoList){
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
   

}