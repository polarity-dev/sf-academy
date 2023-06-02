import { TransactionType } from "../db/connection";
import { users } from "../models/users";
import { ProtoTransaction } from "../proto/com/interfaces/users/v1/transaction_pb";
import { InvalidArgument, PermissionDenied } from "./errors";

const MAX_PASSWD_LENGTH = 32

const email_expression = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
/**
 * Check the validity for an email.
 * @param email 
 * @returns true or false
 */
export const isValidEmail = (email: string): boolean => email_expression.test(email)

/**
 * Check the validity for a password. We don't want
 * long strings to be hashed, so it checks if the passwd is shorter than 32 characters
 * @param password 
 * @returns true or false
 */
export const isValidPassword = (password: string): boolean => password.length <= MAX_PASSWD_LENGTH

/**
 * Parse to float and round possibly null/string value, which in that case is set to 0.
 * We do this because floating points may be returned as strings by the DB.
 * @param n value to be parsed
 * @param digits fractional digits to round the number to
 * @returns a rounded, non null, float number.
 */
export const safeParseFloat = (
    n: number | string = 0, 
    digits = 2
): number => (typeof n === 'string') 
                ? Number(parseFloat(n).toFixed(digits))
                : parseFloat(n.toFixed(digits))

/**
 * Stringify an object and hides some of his fields that becomes empty
 * @param obj The object to stringify
 * @param fields list of labels to hide
 * @returns a string mapping the object without the given hidden fields
 */
export const toJSONByHidingFields = (obj: object, fields: string[]): string => 
    JSON.stringify(obj, (key, val) => 
        // If upperCase(key) in upperCase(fields)
        (fields.map(s=>s.toUpperCase()).includes(key.toUpperCase()))
            ? ''
            : val)

/**
 * Check if a user owns a specific bank account
 * @param user 
 * @param iban 
 * @returns true or false
 */
export const checkIfUserOwnsIban = async(user: users, iban: string) =>
    // This method is usually called after the authentication by a jwt token
    // which eagerly inject bank accounts into user. But in case the field is empty,
    // they're still retrieved from DB
    (user.bank_accounts ?? await user.getBank_accounts())
        .find(user_account => iban.toUpperCase() === user_account.iban.toUpperCase())

/**
 * Check if a user owns a specific IBAN. If not, an error is raised.
 * @param user 
 * @param iban 
 */
export const checkIfUserOwnsIbanThrow = (user: users, iban: string) => {
    if (!checkIfUserOwnsIban(user, iban))    throw new PermissionDenied(`You do not own that bank account`)
}

/**
 * Check correctness of a transaction protobuf object
 * @param trans 
 * @returns a transaction object
 */
export const checkTransactionFields = (trans?: Partial<ProtoTransaction.AsObject>) => {
    if (!trans)                         throw new InvalidArgument("Invalid Transaction: null")
    // Check fields
    if (!trans.bankAccountIban)         throw new InvalidArgument("Invalid IBAN: null")

    /**
     * Transaction is deposit OR buy AND currency name null
     */
    if ((trans.transactionType === TransactionType.DEPOSIT
        || trans.transactionType === TransactionType.BUY) 
        && !trans.buyingCurrencySymbol)   
            throw new InvalidArgument("Invalid Buying Currency Name: null")

    /**
     * Transaction is deposit OR buy AND currency name null 
     */
    if ((trans.transactionType === TransactionType.WITHDRAW
        || trans.transactionType === TransactionType.BUY) 
        && !trans.sellingCurrencySymbol)       
            throw new InvalidArgument("Invalid Selling Currency Name: null")

    if (trans.buyingCurrencyAmount && trans.buyingCurrencyAmount <= 0)      
                                        throw new InvalidArgument("Invalid Currency Amount: negative", 'buyingCurrency')
    if (trans.sellingCurrencyAmount && trans.sellingCurrencyAmount <=0)
                                        throw new InvalidArgument("Invalid Currency Amount: negative", 'sellingCurrency')
    if (!trans.sellingCurrencyAmount && !trans.buyingCurrencyAmount)
                                        throw new InvalidArgument("Invalid Currency Amount: null")
}