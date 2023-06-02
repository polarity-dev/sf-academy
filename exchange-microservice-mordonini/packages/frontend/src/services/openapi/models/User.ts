/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BankAccount } from './BankAccount';
import type { email } from './email';

export type User = {
    id?: number;
    email: email;
    password: string;
    name?: string;
    surname?: string;
    bankAccountsList?: Array<BankAccount>;
};

