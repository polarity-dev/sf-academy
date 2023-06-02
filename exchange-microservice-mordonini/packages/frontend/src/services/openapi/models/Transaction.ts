/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BankAccount } from './BankAccount';
import type { Currency } from './Currency';
import type { DateTime } from './DateTime';
import type { TransactionType } from './TransactionType';

export type Transaction = {
    id?: number;
    date?: DateTime;
    transactionType: TransactionType;
    bankAccount: BankAccount;
    buyingCurrency?: Currency;
    sellingCurrency?: Currency;
};

