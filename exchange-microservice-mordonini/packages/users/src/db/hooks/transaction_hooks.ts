import { findWalletByBankAccountAndCurrency } from "../wallet_operations";
import { transactions } from "../../models/transactions";
import { transaction_types } from "../../models/transaction_types";
import { NotEnoughtCurrency } from "../../utils/errors";

const transactionsToCheck = [
    transaction_types.WITHDRAW,
    transaction_types.BUY
]
  
export const checkBeforeWithdraw = async (
    trans: transactions
) => {
    // Check if the transaction involves a loss
    // of currency (WITHDRAW, BUY)
    if (!transactionsToCheck.includes(<transaction_types>trans.transaction_type)) return
  
    const account = await trans.getBank_account()
    const wallet = await findWalletByBankAccountAndCurrency(account, trans.given_currency_type)
  
    // the wallet may be null 
    // if the user never bought or deposited that currency
    if(!wallet || 
        wallet.currency_amount < trans.given_currency
    )   throw new NotEnoughtCurrency("You don't have enough currency")
    
}