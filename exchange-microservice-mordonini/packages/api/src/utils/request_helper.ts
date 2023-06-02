import { Request } from "express";
import { BuyRequestBody, CurrencyType, DepositRequestBody, LoginRequestBody, SignupRequestBody, WithdrawRequestBody } from "../models";
import { BuyCurrencyRequest } from "../proto/services/users/v1/buy_pb";
import { DepositCurrencyRequest } from "../proto/services/users/v1/deposit_pb";
import { WithdrawCurrencyRequest } from "../proto/services/users/v1/withdraw_pb";
import { getBearerToken } from "./token";
import { LoginRequest } from "../proto/services/users/v1/login_pb";
import { SignupRequest } from "../proto/services/users/v1/signup_pb";
import { ListTransactionsRequest } from "../proto/services/users/v1/list_transactions_pb";


/**
 * Inspect request body to create a proper gRPC request for the desired service
 * @param req Express HTTP request
 * @returns a gRPC request
 */
export const makeDepositRequest = (req: Request): DepositCurrencyRequest => {
    const token = getBearerToken(req)
    const body: DepositRequestBody = req.body
    
    return new DepositCurrencyRequest()
        .setToken(token)
        .setCurrency(body.currency.name)
        .setAmount(body.currency.amount)
        .setIban(body.iban)
}

/**
 * Inspect request body to create a proper gRPC request for the desired service
 * @param req Express HTTP request
 * @returns a gRPC request
 */
export const makeWithdrawRequest = (req: Request): WithdrawCurrencyRequest => {
    const token = getBearerToken(req)
    const body: WithdrawRequestBody = req.body
    
    return new WithdrawCurrencyRequest()
        .setToken(token)
        .setCurrency(body.currency.name)
        .setAmount(body.currency.amount)
        .setIban(body.iban)
}

/**
 * Inspect request body to create a proper gRPC request for the desired service
 * @param req Express HTTP request
 * @returns a gRPC request
 */
export const makeBuyRequest = (req: Request): BuyCurrencyRequest => {
    const token = getBearerToken(req)
    const body: BuyRequestBody = req.body
    
    return new BuyCurrencyRequest()
        .setToken(token)
        .setBuyingCurrency(body.buyingCurrency.name)
        .setBuyingAmount(body.buyingCurrency.amount)
        .setSellingCurrency(body.sellingCurrency.name)
        .setIban(body.iban)
}

/**
 * Inspect request body to create a proper gRPC request for the desired service
 * @param req Express HTTP request
 * @returns a gRPC request
 */
export const makeLoginRequest = (req: Request): LoginRequest => {
    const body: LoginRequestBody = req.body

    return new LoginRequest()
        .setEmail(body.email)
        .setPassword(body.password)
}

/**
 * Inspect request body to create a proper gRPC request for the desired service
 * @param req Express HTTP request
 * @returns a gRPC request
 */
export const makeSignupRequest = (req: Request): SignupRequest => {
    const body: SignupRequestBody = req.body

    return new SignupRequest()
        .setEmail(body.email)
        .setIban(body.iban)
        .setName(body.name)
        .setSurname(body.surname)
        .setPassword(body.password)
}

const convertToArray = <T>(value: T | T[]): T[] => {
    return Array.isArray(value)
        ? value
        : [value]
}

/**
 * Inspect request body to create a proper gRPC request for the desired service
 * @param req Express HTTP request
 * @returns a gRPC request
 */
export const makeListTransactionsRequest = (req: Request): ListTransactionsRequest => {
    const token = getBearerToken(req)
    const {
        iban,
        afterThen,
        beforeThen,
        boughtCurrencies,
        soldCurrencies
    } = req.query
    return new ListTransactionsRequest()
        .setToken(token)
        .setIban(<string>iban)
        .setAfterThen(<string>afterThen)
        .setBeforeThen(<string>beforeThen)
        .setBoughtCurrencyNameList(<CurrencyType[]>convertToArray(boughtCurrencies))
        .setSoldCurrencyNameList(<CurrencyType[]>convertToArray(soldCurrencies))
}