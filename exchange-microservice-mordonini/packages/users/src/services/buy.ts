import { InvalidArgument } from "../utils/errors";

import { checkIfUserOwnsIban, checkTransactionFields, createBuyResponse, logger } from "../utils";
import { UserPermissions } from "../auth";
import { BuyCurrencyRequest, BuyCurrencyResponse } from "../proto/services/users/v1/buy_pb";

// Authentication
import { authUser } from "../utils/auth_helper";

// Exchange service client and stubs
import exchangeClient from "../utils/exchange_client"
import { ExchangeRequest } from "../proto/services/exchange/v1/exchange_pb";

import { ProtoCatCall, CallType } from "protocat";
import { TransactionType } from "../db/connection";
import { createBuyTransaction } from "../db/transaction_operations";

/**
 * Maps the external request into valid parameters 
 * for the service implementation and send results/errors to the recipient.
 * @param call 
 */
export const buyCurrency = async(
    call: ProtoCatCall<unknown, BuyCurrencyRequest, BuyCurrencyResponse, CallType.Unary>
) => {
    const requestObject = call.request.toObject()
    // Get parameters from request
    const {
        token,
        iban,
        buyingAmount,
        buyingCurrency,
        sellingCurrency
    } = requestObject
    
    checkTransactionFields({
        bankAccountIban: iban,
        transactionType: TransactionType.BUY,
        buyingCurrencySymbol: buyingCurrency,
        buyingCurrencyAmount: buyingAmount,
        sellingCurrencySymbol: sellingCurrency
    })
    
    // Authentication
    const user = await authUser(token, [UserPermissions.BUY])
    // Check if user owns that bank account
    const bankAccount = await checkIfUserOwnsIban(user, iban)
    if (!bankAccount)   throw new InvalidArgument(`Invalid iban ${iban}: not found`)
    
    // Preparing request for exchange server
    const req = new ExchangeRequest()
        .setFrom(sellingCurrency)
        .setTo(buyingCurrency)
        .setValue(buyingAmount)
    
    // Calling remote exchange service
    exchangeClient.exchange(req, async (err, exchangeResp) => {
        if (err){
            logger.warn(err.details)
            return
        }
        // extract exchanged currency from response
        const sellingCurrencyAmount = exchangeResp.getResult()
        
        // Logging
        logger.debug(`issuing transaction
- User ID ${user.id}
- Buying Bank Account ${bankAccount.iban}
- Buying ${buyingAmount} ${buyingCurrency}
- Selling ${sellingCurrencyAmount} ${sellingCurrency}`
        )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const createdTransaction = await createBuyTransaction(
            bankAccount,
            buyingCurrency,
            buyingAmount,
            sellingCurrency,
            sellingCurrencyAmount
        )
        // Response
        const protoBuyResponse = await createBuyResponse(createdTransaction)
        call.response.setWalletsList(protoBuyResponse.getWalletsList())
    })

}