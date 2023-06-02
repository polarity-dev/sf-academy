/**
 * TransactionService wrapper
 */

import {
    Buy,
    CurrencyArray,
    DateTime,
    Deposit,
    TransactionArray,
    TransactionsService,
    WalletArray,
    Withdraw,
} from '../openapi'

const {
    buyTransactions,
    depositTransactions,
    withdrawTransactions,
    listTransactions
} = TransactionsService

/**
 * Service wrapper
 * @param buyRequest 
 * @returns 
 */
export const doBuyTransactions = (buyRequest: Buy): Promise<WalletArray> => buyTransactions(buyRequest)

/**
 * ServiceWrapper
 * @param depositRequest 
 * @returns 
 */
export const doDepositTransactions = (depositRequest: Deposit): Promise<WalletArray> => depositTransactions(depositRequest)

/**
 * ServiceWrapper
 * @param withdrawRequest 
 * @returns 
 */
export const doWithdrawTransactions = (withdrawRequest: Withdraw): Promise<WalletArray> => withdrawTransactions(withdrawRequest)

/**
 * Service wrapper
 * @param iban 
 * @param beforeThen 
 * @param afterThen 
 * @returns 
 */
export const doListTransactions = (
    iban: string,
    beforeThen: DateTime,
    afterThen: DateTime,
    boughtCurrencies?: CurrencyArray,
    soldCurrencies?: CurrencyArray,
): Promise<TransactionArray> => listTransactions(iban, beforeThen, afterThen, boughtCurrencies, soldCurrencies)