import { InvalidArgument } from "../utils/errors";

import { UserPermissions } from "../auth";
import { WithdrawCurrencyRequest, WithdrawCurrencyResponse } from "../proto/services/users/v1/withdraw_pb";
import { 
    authUser, 
    checkIfUserOwnsIban, 
    checkTransactionFields, 
    createWithdrawResponse
} from "../utils";

import { ProtoCatCall, CallType } from "protocat";
import { TransactionType } from "../db/connection";
import { createWithdrawTransaction } from "../db/transaction_operations";

/**
 * Maps the external request into valid parameters 
 * for the service implementation and send results/errors to the recipient.
 * @param call 
 */
export const withdrawCurrency = async(
    call: ProtoCatCall<unknown, WithdrawCurrencyRequest, WithdrawCurrencyResponse, CallType.Unary>,
) => {
    // Get request data
    const requestObject = call.request.toObject()
    // Get parameters from request
    const {
        token,
        iban,
        currency,
        amount,
    } = requestObject
    
    checkTransactionFields({
        bankAccountIban: iban,
        transactionType: TransactionType.WITHDRAW,
        sellingCurrencySymbol: currency,
        sellingCurrencyAmount: amount,
    })
    // Auth
    const user = await authUser(token, [UserPermissions.WITHDRAW])

    // Check if user owns that bank account
    const bankAccount = await checkIfUserOwnsIban(user, iban)
    if (!bankAccount)   throw new InvalidArgument(`Invalid iban ${iban}: not found`)

    // Business logic
    const createdTransaction = await createWithdrawTransaction(
        bankAccount,
        currency,
        amount
    )
    
    // Response
    const protoWithdrawResponse = await createWithdrawResponse(createdTransaction)
    call.response.setWalletsList(protoWithdrawResponse.getWalletsList())
}