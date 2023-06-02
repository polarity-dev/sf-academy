import { transactions } from "../models/transactions"
import { wallets } from "../models/wallets"
import { findWalletsByTransaction } from "../db/wallet_operations"
import { ProtoWallet } from "../proto/com/interfaces/users/v1/wallet_pb"
import { ProtoTransaction } from "../proto/com/interfaces/users/v1/transaction_pb"
import { BuyCurrencyResponse } from "../proto/services/users/v1/buy_pb"
import { DepositCurrencyResponse } from "../proto/services/users/v1/deposit_pb"
import { ListTransactionsResponse } from "../proto/services/users/v1/list_transactions_pb"
import { WithdrawCurrencyResponse } from "../proto/services/users/v1/withdraw_pb"
import { safeParseFloat } from "./param_helper"
import { users } from "../models/users"
import { ProtoUser } from "../proto/com/interfaces/users/v1/user_pb"
import { SignupResponse } from "../proto/services/users/v1/signup_pb"
import { LoginResponse } from "../proto/services/users/v1/login_pb"
import { bank_accounts } from "../models/bank_accounts"
import { ProtoBankAccount } from "../proto/com/interfaces/users/v1/bank_account_pb"

/**
 * Maps internal model type 'users' to external (protobuf compatible) type
 * @param user Internal model type 'users'
 * @returns external (protobuf compatible) user
 */
export const userToProto = (user: users): ProtoUser => 
    new ProtoUser()
        .setId(user.id)
        .setEmail(user.email)
        .setName(user.name)
        .setSurname(user.surname)
        .setBankAccountsList(user.bank_accounts.map(bankAccountToProto))

/**
 * Maps internal model type 'transactions' to external (protobuf compatible) type
 * @param user Internal model type 'transactions'
 * @returns external (protobuf compatible) transaction
 */
const transactionToProto = (trans: transactions): ProtoTransaction =>
    new ProtoTransaction()
        .setId(trans.id)
        .setDate(trans.creation_date.toISOString())
        .setBankAccountIban(trans.bank_account.iban)
        .setBuyingCurrencySymbol(trans.obtained_currency_type)
        .setBuyingCurrencyAmount(safeParseFloat(trans.obtained_currency))
        .setSellingCurrencyAmount(safeParseFloat(trans.given_currency))
        .setSellingCurrencySymbol(trans.given_currency_type)
        .setTransactionType(trans.transaction_type)

/**
 * Map model object 'wallet' to proto object ProtoWallet
 * @param wallet 
 * @returns ProtoWallet
 */
const walletToProto = (wallet: wallets): ProtoWallet =>
    new ProtoWallet()
        .setId(wallet.id)
        .setBankAccountId(wallet.bank_account_id)
        .setCurrencyName(wallet.currency_type)
        .setCurrencyAmount(wallet.currency_amount)


const bankAccountToProto = (account: bank_accounts): ProtoBankAccount => {
    return new ProtoBankAccount()
        .setId(account.id)
        .setIban(account.iban)
        .setUserId(account.user_id)
        .setCreationDate(account.creation_date.toISOString())
}
/* RESPONSE HELPERS */
  
export const createListTransactionsResponse = (transs: transactions[]): ListTransactionsResponse =>
    new ListTransactionsResponse()
        .setTransactionsList(transs.map(transactionToProto))
    
export const createSignupResponse = (user: users, auth_token: string) =>
    new SignupResponse()
        .setUser(userToProto(user))
        .setToken(auth_token)


export const createLoginResponse = (user: users, auth_token: string) => 
    new LoginResponse()
        .setUser(userToProto(user))
        .setToken(auth_token)

export const createDepositResponse = async(trans: transactions): Promise<DepositCurrencyResponse> =>
    new DepositCurrencyResponse()
        .setWalletsList(
            (await findWalletsByTransaction(trans)).map(walletToProto)
        )

export const createWithdrawResponse = async(trans: transactions): Promise<WithdrawCurrencyResponse> =>
    new WithdrawCurrencyResponse()
        .setWalletsList(
            (await findWalletsByTransaction(trans)).map(walletToProto)
        )

export const createBuyResponse = async(trans: transactions): Promise<BuyCurrencyResponse> =>
    new BuyCurrencyResponse()
        .setWalletsList(
            (await findWalletsByTransaction(trans)).map(walletToProto)
        )

