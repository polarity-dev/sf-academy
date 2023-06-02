/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DateTime } from './DateTime';

export type BankAccount = {
    id?: number;
    iban: string;
    creationDate?: DateTime;
    userId?: number;
};

