import { Crypto } from "../entity/crypto";
import { Transaction } from "../entity/transaction";
import { getMainPage } from './mainPage/mainPage';
import { getCryptoTable } from './cryptoTable/cryptoTable';
import { User } from "../entity/user";
import { getTrasactionTable } from "./transactionTable/trasactionTable";

export class HtmlManager {

    getMainpage(cryptoList : Crypto[], user : User){
        return getMainPage(cryptoList, user)
    }
    
    getCryptoTable(cryptoList : Crypto[]) : string {
        return getCryptoTable(cryptoList)
    }

    getTransactionTable(transactionList : Transaction[]) : string{
        return getTrasactionTable(transactionList)
    }

}