import { Crypto } from "../entity/crypto";
import { Transaction } from "../entity/transaction";
import { getMainPage } from './mainPage/mainPage';
import { getCryptoTable } from './cryptoTable/cryptoTable';

export class HtmlManager {

    getMainpage(cryptoList : Crypto[]){
        return getMainPage(cryptoList)
    }
    
    getCryptoTable(cryptoList : Crypto[]) : string {
        return getCryptoTable(cryptoList)
    }

}