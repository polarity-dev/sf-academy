import { ListTransactionsRequest } from "../proto/services/users/v1/list_transactions_pb"
import { LoginRequest } from "../proto/services/users/v1/login_pb"
import { SignupRequest } from "../proto/services/users/v1/signup_pb"
import { Currency } from "./currency"

export type WithdrawRequestBody = {
    iban: string,
    currency: Currency
}

export type DepositRequestBody = WithdrawRequestBody

export type BuyRequestBody = {
    iban: string
    buyingCurrency: Currency,
    sellingCurrency: Currency
}

export type LoginRequestBody = LoginRequest.AsObject

export type SignupRequestBody = SignupRequest.AsObject

export type ListTransactionsBody = ListTransactionsRequest.AsObject