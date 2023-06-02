import { BankAccount, Transaction, TransactionType } from "./connection";
import { findAccountByIban } from "./bank_account_operations";
import { Op } from "sequelize";
import { bank_accounts } from "../models/bank_accounts";
import { transactions } from "../models/transactions";

/**
 * Return a list of transactions given an IBAN, optionally filtered by two dates
 * @param iban 
 * @param before_then Default: now()
 * @param after_then Default: 0
 * @returns A list of transactions issued from the input IBAN, or an empty one if no transactions were commited by it.
 * @returns Null if the iban is not in the system
 */
export const getTransactionList = async(
    iban: string | bank_accounts,
    before_then?: Date,
    after_then?: Date,
    obtainedCurrencyNames?: string[],
    givenCurrencyNames?: string[]
): Promise<transactions[] | null> => {
    const account = (typeof iban ==='string')
        ? (await findAccountByIban(iban))
        : iban
    
    if (!account)  return null
    // account not null
    return await account.getTransactions({
        where: {
            creation_date: {
                [Op.lte]: before_then || new Date(),
                [Op.gte]: after_then || new Date(0)
            },
            // Filte by currencies
            // { [Op.not]: null} means no filter.
            obtained_currency_type: (obtainedCurrencyNames && obtainedCurrencyNames.length) ? { [Op.in]: obtainedCurrencyNames } : { [Op.not]: null},
            given_currency_type: (givenCurrencyNames && givenCurrencyNames.length) ? {[Op.in]: givenCurrencyNames} : { [Op.not]: null},
        },
        include: { model: BankAccount, as: 'bank_account' }

    })
}

export const createTransaction = async(
    account: bank_accounts,
    buyingCurrencySymbol: string,
    buyingCurrencyAmount: number,
    sellingCurrencySymbol: string,
    sellingCurrencyAmount: number,
    transType: TransactionType
): Promise<transactions> => 
    Transaction.create({
        bank_account_id: account.id,
        transaction_type: transType,
        given_currency_type: sellingCurrencySymbol,
        given_currency: sellingCurrencyAmount,
        obtained_currency: buyingCurrencyAmount,
        obtained_currency_type: buyingCurrencySymbol
    })


export const createBuyTransaction = (
    account: bank_accounts,
    buyingCurrencySymbol: string,
    buyingCurrencyAmount: number,
    sellingCurrencySymbol: string,
    sellingCurrencyAmount: number
): Promise<transactions> => 
    createTransaction(account, buyingCurrencySymbol, buyingCurrencyAmount, sellingCurrencySymbol, sellingCurrencyAmount, TransactionType.BUY)


export const createDepositTransaction = (
    account: bank_accounts,
    currencySymbol: string,
    currencyAmount: number
): Promise<transactions> => 
    createTransaction(account, currencySymbol, currencyAmount, currencySymbol, 0, TransactionType.DEPOSIT)



export const createWithdrawTransaction = (
    account: bank_accounts,
    currencySymbol: string,
    currencyAmount: number
): Promise<transactions> => 
    createTransaction(account, currencySymbol, 0, currencySymbol, currencyAmount, TransactionType.WITHDRAW)