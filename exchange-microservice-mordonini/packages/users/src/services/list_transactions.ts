import { 
    ListTransactionsRequest, 
    ListTransactionsResponse 
} from "../proto/services/users/v1/list_transactions_pb";
import { getTransactionList } from "../db/transaction_operations";
import { InvalidArgument, UnauthenticatedError } from "../utils/errors";

import { UserPermissions } from '../auth';

import { authUser, createListTransactionsResponse, checkIfUserOwnsIban } from "../utils";
import { CallType, ProtoCatCall } from "protocat";

/**
 * Maps the external request into valid parameters 
 * for the service implementation and send results/errors to the recipient.
 * @param call 
 */
export const listTransactions = async(
    call: ProtoCatCall<
        unknown, 
        ListTransactionsRequest, 
        ListTransactionsResponse, 
        CallType.Unary>
) => {
    const requestObject = call.request.toObject()
    const { 
        iban, 
        beforeThen, 
        afterThen, 
        token,
        boughtCurrencyNameList,
        soldCurrencyNameList
    } = requestObject
    
    // Checking parameters. before/after_then may be null
    if (!token) throw new UnauthenticatedError(`Invalid Token: null`)
    if (!iban)  throw new InvalidArgument(`Null IBAN`)
    
    // Authentication
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await authUser(token, [UserPermissions.LIST_TRANSACTIONS])

    // Check if user owns that bank account
    const bankAccount = await checkIfUserOwnsIban(user, iban)
    if (!bankAccount)   throw new InvalidArgument(`Invalid iban ${iban}: not found`)
    
    // Get transactions list
    const beforeThenDate = beforeThen ? new Date(beforeThen) : new Date()
    const afterThenDate = afterThen ? new Date(afterThen) : new Date(0)
    const accountTransactions = await getTransactionList(iban, beforeThenDate , afterThenDate, boughtCurrencyNameList, soldCurrencyNameList) || []

    // Response
    call.response.setTransactionsList(createListTransactionsResponse(accountTransactions).getTransactionsList())
    
}