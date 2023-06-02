/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Currency } from './Currency';

/**
 * object representing a buy request
 */
export type Buy = {
    iban: string;
    buyingCurrency: Currency;
    sellingCurrency: Currency;
};

