enum CurrenciesCode{
    UNSPECIFIED,
    USD,
    JPY,
    CZK,
    DKK,
    GBP,
    HUF,
    PLN,
    RON,
    SEK,
    CHF,
    ISK,
    NOK,
    TRY,
    AUD,
    BRL,
    CAD,
    CNY,
    HKD,
    IDR,
    ILS,
    INR,
    KRW,
    MXN,
    MYR,
    NZD,
    PHP,
    SGD,
    THB,
    ZAR,
    EUR,
}

const toSymbol = (n: CurrenciesCode): string => CurrenciesCode[n]
const fromSymbol = (s: string): CurrenciesCode => Object.values(CurrenciesCode).indexOf(`${s.toUpperCase()}`);

const currencies = CurrenciesCode

export default { toSymbol, fromSymbol, currencies}