export type CurrencyType = "USD"|
"JPY"|
"CZK"|
"DKK"|
"GBP"|
"HUF"|
"PLN"|
"RON"|
"SEK"|
"CHF"|
"ISK"|
"NOK"|
"TRY"|
"AUD"|
"BRL"|
"CAD"|
"CNY"|
"HKD"|
"IDR"|
"ILS"|
"INR"|
"KRW"|
"MXN"|
"MYR"|
"NZD"|
"PHP"|
"SGD"|
"THB"|
"ZAR"|
"EUR"

export type Currency = {
    name: CurrencyType,
    amount: number
}