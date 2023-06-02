import { UserPermissions } from "../auth"
import { verifyJWT } from "../auth/jwt"
import { InternalError, InvalidToken } from "./errors"
import { findUserByFingerprint } from "../db/user_operations"


/**
 * Authenticate the user by an iban that must be bound to him
 * @param token JWT
 * @param iban 
 * @param permissions permissions required by the use case
 * @returns the authenticated bank account (the user is accessible within the returned account)
 */
export const authUser = async(
    token: string, 
    permissions: UserPermissions[] = []
) => {
    // First: token verification
    const myPayload = await verifyJWT(token, permissions)
    if (!myPayload.aud )     throw new InternalError("Invalid JWT payload: audience null")
    else if (typeof myPayload.aud !== 'string')     throw new InternalError(`Invalid JWT payload: audience is not a string: ${myPayload.aud}`)
    
    // Extract user fingerprint from the payload
    const fingerprint = myPayload.aud
    // Search for user
    const user = await findUserByFingerprint(fingerprint)
    if (!user)   throw new InvalidToken(`Invalid token`, ` fingerprint: ${fingerprint}`)

    return user
}