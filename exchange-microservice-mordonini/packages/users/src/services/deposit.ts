import { 
    DepositCurrencyRequest, 
    DepositCurrencyResponse 
} from "../proto/services/users/v1/deposit_pb";
import { InvalidArgument } from "../utils/errors";

import { UserPermissions } from "../auth";
import { 
    authUser, 
    createDepositResponse, 
    checkIfUserOwnsIban, 
    checkTransactionFields 
} from "../utils";
import { ProtoCatCall, CallType } from "protocat";
import { TransactionType } from "../db/connection";
import { createDepositTransaction } from "../db/transaction_operations";

/**
 * Maps the external request into valid parameters 
 * for the service implementation and send results/errors to the recipient.
 * @param call 
 */
export const depositCurrency = async(
    call: ProtoCatCall<unknown, DepositCurrencyRequest, DepositCurrencyResponse, CallType.Unary>
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
        transactionType: TransactionType.DEPOSIT,
        buyingCurrencySymbol: currency,
        buyingCurrencyAmount: amount,
    })
    
    // Authentication
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await authUser(token, [UserPermissions.DEPOSIT])
    // Check if user owns that bank account
    const bankAccount = await checkIfUserOwnsIban(user, iban)
    if (!bankAccount)   throw new InvalidArgument(`Invalid iban ${iban}: not found`)
    
    const createdTransaction = await createDepositTransaction(
        bankAccount,
        currency,
        amount
    )
    const protoDepositResponse = await createDepositResponse(createdTransaction)
    // Response
    call.response.setWalletsList(protoDepositResponse.getWalletsList())
}