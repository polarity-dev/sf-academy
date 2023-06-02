import { InternalError, InvalidArgument } from '../utils/errors';
import { ExchangeRequest, ExchangeResponse } from '../proto/services/exchange/v1/exchange_pb';

import { CallType, ProtoCatCall } from 'protocat';

import logger from '../utils/logger';
import { getRates } from '../utils/ceb_api';

export enum Currencies{ 
    DEF, USD, JPY, CZK,
    DKK, GBP, HUF, PLN,
    RON, SEK, CHF, ISK,
    NOK, TRY, AUD, BRL,
    CAD, CNY, HKD, IDR,
    ILS, INR, KRW, MXN,
    MYR, NZD, PHP, SGD,
    THB, ZAR, EUR
}

export interface Rate {
    currency: string;
    rate: number;
}

export interface ExchangeList{
    exchangeRates: Array<Rate>;
    time: string
}

// Number of digit approximation
const FP_PRECISION_APPROX = 2

export interface ExchangeParameters{
    from: string,
    to: string,
    value: number
}

/**
 * Check correctness of parameters
 * @param par 
 * @throws InvalidArgument
 */
const checkParameters = (par: ExchangeParameters) => {
    const { value, from, to } = par
    // Check parameters. Error is raised if value is non positive, both currencies are equal or none is EUR
    if (
        value <= 0 
        || from === to 
        || (from !== Currencies[Currencies.EUR] && to !== Currencies[Currencies.EUR])
        || !(Object.keys(Currencies).includes(to))
        || !(Object.keys(Currencies).includes(from)))
    {
        throw new InvalidArgument(`currencies are equal, none is EUR or value is non positive. from:${from} to:${to} value:${value}`)
    }
}

export const exchange = async(
    call: ProtoCatCall<unknown, ExchangeRequest, ExchangeResponse, CallType.Unary>
) => {
    const parameters: ExchangeParameters = call.request.toObject()
    
    checkParameters(parameters)
    // Call exchange function
    const result = await doExchange(parameters)

    // Create response
    call.response.setResult(result)
}

/**
 * Implementation of the business logi
 * @param par 
 * @returns exchanged currency
 * @throws InternalError
 */
export const doExchange = async(par: ExchangeParameters): Promise<number> => {
    const { from, to, value } = par
    const exchangeRatesList = await getRates()

    // Check if chaning EUR into [other] or viceversa
    const changingFromEur = from === Currencies[Currencies.EUR]

    // Look for the currency to search for in the exchange rate list
    // It mustn't be EUR
    const desiredCurrency = changingFromEur ? to : from

    // Search for the rate of the desired currency
    const desiredRate = exchangeRatesList.exchangeRates.filter((rate: Rate) =>
        (rate.currency === desiredCurrency) && rate.currency !== Currencies[Currencies.DEF]
        ).pop()
    
    if (!desiredRate)   throw new InternalError('Desired Rate null')
    /* If changing Euros into [other], the rate is exactly what we 
    *  extracted in the previous step. If not, it has to be changed
    */
    const scaleFactor: number = (changingFromEur ? 1/desiredRate.rate : desiredRate.rate)
    const exchangedCurrency: number = parseFloat((value*scaleFactor).toFixed(FP_PRECISION_APPROX))
    logger.debug(`
- changing from ${value} ${from} to ${to}
- desiredCurrency: ${desiredCurrency}
- desiredRate: ${desiredRate.rate} ${desiredRate.currency}
- scaleFactor: ${scaleFactor}
- exchangedCurrency: ${exchangedCurrency}
    `)
    return exchangedCurrency
}