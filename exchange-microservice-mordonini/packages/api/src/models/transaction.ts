import { BankAccount } from "./bank_account";
import { Currency } from "./currency";

export type Transaction = {
    id: number,
    date: Date,
    transactionType: string,
    bankAccount: BankAccount,
    buyingCurrency: Currency,
    sellingCurrency: Currency,
}