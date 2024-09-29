import { Crypto } from "../entity/crypto";
import { Transaction } from "../entity/transaction";
import { getMainPage } from './mainPage/mainPage';
import { getCryptoTable } from './cryptoTable/cryptoTable';
import { User } from "../entity/user";

export class HtmlManager {

    getMainpage(cryptoList : Crypto[], user : User, transactionList : Transaction[]){
        return getMainPage(cryptoList, user, transactionList)
    }
    
    getCryptoTable(cryptoList : Crypto[]) : string {
        return getCryptoTable(cryptoList)
    }

}