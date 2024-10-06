import { Crypto } from "../entity/crypto";
import { Transaction } from "../entity/transaction";
import { getMainPage } from './mainPage/mainPage';
import { getCryptoTable } from './cryptoTable/cryptoTable';
import { User } from "../entity/user";
import { getTrasactionTable } from "./transactionTable/trasactionTable";
import { getTrasactionForm } from "./transactionForm/transactionForm";
import { getUserWallet } from "./wallet/wallet";
import { Wallet } from "../entity/wallet";

export class HtmlManager {

    getMainpage(cryptoList : Crypto[], user : User){
        return getMainPage(cryptoList, user)
    }
    
    getCryptoTable(cryptoList : Crypto[]) : string {
        return getCryptoTable(cryptoList)
    }

    getTransactionTable(transactionList : Transaction[], tableType : string) : string{
        return getTrasactionTable(transactionList, tableType)
    }

    getTransactionForm(cryptoList : Crypto[]){
        return getTrasactionForm(cryptoList)
    }

    getUserWallet(wallet : Wallet[]){
        return getUserWallet(wallet)
    }

}