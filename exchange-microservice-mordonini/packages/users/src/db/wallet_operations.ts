import { bank_accounts } from "../models/bank_accounts";
import { wallets } from "../models/wallets";
import { Wallet } from "./connection";
import { transactions } from "../models/transactions";

export const findWalletByBankAccountAndCurrency = (
    account: bank_accounts,
    currency: string
): Promise<wallets | null> =>  
    Wallet.findOne({
        where: {
            bank_account_id: account.id,
            currency_type: currency
        }
    })


export const findWalletsByBankAccount = (
    account: bank_accounts
): Promise<wallets[]> => 
    Wallet.findAll({ where: {bank_account_id: account.id } })


/**
 * Find every wallet linked to the given transaction
 * @param trans the transaction
 * @returns a list of wallets
 */
export const findWalletsByTransaction = (
    trans: transactions
): Promise<wallets[]> =>
    Wallet.findAll({ where: {bank_account_id: trans.bank_account_id} })