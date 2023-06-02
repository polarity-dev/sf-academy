/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Buy } from '../models/Buy';
import type { CurrencyArray } from '../models/CurrencyArray';
import type { DateTime } from '../models/DateTime';
import type { Deposit } from '../models/Deposit';
import type { TransactionArray } from '../models/TransactionArray';
import type { WalletArray } from '../models/WalletArray';
import type { Withdraw } from '../models/Withdraw';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TransactionsService {

    /**
     * CORS support
     * Enable CORS by returning correct headers
     * @returns string Default response for CORS method
     * @throws ApiError
     */
    public static optionsTransactions(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'OPTIONS',
            url: '/transactions',
            responseHeader: 'Access-Control-Allow-Origin',
        });
    }

    /**
     * List transactions
     * List transactions. Authenticated user only.
     * @param iban IBAN
     * @param beforeThen A date-time value to filter transactions
     * @param afterThen A date-time value to filter transactions
     * @param boughtCurrencies list of currency name to filter transactions
     * @param soldCurrencies list of currency name to filter transactions
     * @returns TransactionArray Object retrieved after listTransactions operations
     * @throws ApiError
     */
    public static listTransactions(
        iban: string,
        beforeThen?: DateTime,
        afterThen?: DateTime,
        boughtCurrencies?: CurrencyArray,
        soldCurrencies?: CurrencyArray,
    ): CancelablePromise<TransactionArray> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/transactions',
            query: {
                'iban': iban,
                'beforeThen': beforeThen,
                'afterThen': afterThen,
                'boughtCurrencies': boughtCurrencies,
                'soldCurrencies': soldCurrencies,
            },
        });
    }

    /**
     * CORS support
     * Enable CORS by returning correct headers
     * @returns string Default response for CORS method
     * @throws ApiError
     */
    public static optionsTransactionsBuy(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'OPTIONS',
            url: '/transactions/buy',
            responseHeader: 'Access-Control-Allow-Origin',
        });
    }

    /**
     * Buy currency
     * Buy currency. Authenticated user only.
     * @param requestBody Buy Request object
     * @returns WalletArray Object retrieved after every buy/deposit/withdraw operation
     * @throws ApiError
     */
    public static buyTransactions(
        requestBody?: Buy,
    ): CancelablePromise<WalletArray> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/transactions/buy',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * CORS support
     * Enable CORS by returning correct headers
     * @returns string Default response for CORS method
     * @throws ApiError
     */
    public static optionsTransactionsDeposit(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'OPTIONS',
            url: '/transactions/deposit',
            responseHeader: 'Access-Control-Allow-Origin',
        });
    }

    /**
     * Deposit currency
     * Deposit currency. Authenticated user only.
     * @param requestBody Deposit Request object
     * @returns WalletArray Object retrieved after every buy/deposit/withdraw operation
     * @throws ApiError
     */
    public static depositTransactions(
        requestBody?: Deposit,
    ): CancelablePromise<WalletArray> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/transactions/deposit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * CORS support
     * Enable CORS by returning correct headers
     * @returns string Default response for CORS method
     * @throws ApiError
     */
    public static optionsTransactionsWithdraw(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'OPTIONS',
            url: '/transactions/withdraw',
            responseHeader: 'Access-Control-Allow-Origin',
        });
    }

    /**
     * Withdraw currency
     * Withdraw currency. Authenticated user only.
     * @param requestBody Withdraw Request object
     * @returns WalletArray Object retrieved after every buy/deposit/withdraw operation
     * @throws ApiError
     */
    public static withdrawTransactions(
        requestBody?: Withdraw,
    ): CancelablePromise<WalletArray> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/transactions/withdraw',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
