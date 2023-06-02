/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Currency } from './Currency';

/**
 * object representing a deposit request
 */
export type Deposit = {
    iban: string;
    currency: Currency;
};

