/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Currency } from './Currency';

/**
 * object representing a withdraw request
 */
export type Withdraw = {
    iban: string;
    currency: Currency;
};

