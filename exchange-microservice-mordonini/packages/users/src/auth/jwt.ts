import * as jose from 'jose'
import * as fs from 'fs'
import * as path from 'path'
import { UserPermissions } from './permissions'
import { InternalError, InvalidPermissions, InvalidToken } from '../utils/errors'
import logger from '../utils/logger'
import { users } from '../models/users'

interface MyJWTPayload extends jose.JWTPayload{
    permissions: UserPermissions[]
}

/**
 * signing/verifing algorithm
 */
const alg = 'RS256'

/**
 * Private and public key location in filesystem
 */
const { 
    KEY_FILE = '',
    PUBKEY_FILE = ''
} = process.env

/**
 * Signing key
 */
const privateKey = fs.readFileSync(path.join(KEY_FILE), "utf8")
/**
 * Verifing key
 */
const publicKey = fs.readFileSync(path.join(PUBKEY_FILE), "utf8")

const generateJWTPermissionsBody = (rights?: UserPermissions[]): MyJWTPayload => {
    return {
        permissions: rights || [
            UserPermissions.BUY,
            UserPermissions.DEPOSIT,
            UserPermissions.WITHDRAW,
            UserPermissions.LIST_TRANSACTIONS
        ]
    }
}

/**
 * Generates a JWT token based on the user attributes
 * @param user the user to generate the token for
 * @param duration token validity in minutes
 */
export const generateJWT = async(
    user: users, 
    duration: number = 240*60, 
    permissions?: UserPermissions[]
): Promise<string> => {
    
    const body = generateJWTPermissionsBody(permissions)
    return await new jose.SignJWT(body)
        .setProtectedHeader({ alg })
        .setAudience(user.fingerprint)
        .setIssuedAt()
        .setIssuer('superAffordableAuthEntity')
        .setExpirationTime(`${duration}m`)
        .sign(await jose.importPKCS8(privateKey, alg))
}

/**
 * Verifies the JWT integrity
 * @param userId user id
 * @param token JWT string
 * @param expectedPermissions permissions to be checked on the user
 * @throws JWTClaimValidationError, JTWExpired, JWTInvalid, InvalidPermissions
 */
export const verifyJWT 
= async(
    token: string, 
    expectedPermissions: UserPermissions[]
): Promise<MyJWTPayload> => {
    // Token Validation
    const decodedPayload = jose.decodeJwt(token)
    
    const { payload }  = await jose.jwtVerify(
        token, 
        await jose.importSPKI(publicKey, alg), 
        {
            issuer: decodedPayload.iss,
            audience: decodedPayload.aud
        }
    )
    .catch(error => {
        /* Cannot try-catch using jose errors, it yields import error within the module itself
        if (error instanceof JWTClaimValidationFailed
            || error instanceof JWTInvalid)
            throw new InvalidToken("Autenticazione fallita. Rieffettuare il login", error.message)
        else if (error instanceof JWTExpired)
            throw new TokenValidityExpired("Sessione scaduta. Rieffettuare il login", error.message)
        */
       throw new InvalidToken("Authentication failed. Please retry login.", error.message)
    })
    .then(obj => obj ? obj : { payload: null})
    
    if (!payload)   throw new InternalError('Somethign went wrong during authentication', 'Payload empty')
    
    const myPayload = payload as MyJWTPayload
    
    // Permission verification
    // check if required permissions (expectedPermissions) 
    // are included inside user permissions (described in the payload)
    const permissionsVerified = expectedPermissions.every(perm => myPayload.permissions.includes(perm))    
    
    if (!permissionsVerified){ 
        const expected = expectedPermissions.map(perm => UserPermissions[perm])
        const found = (payload as MyJWTPayload).permissions.map(perm => UserPermissions[perm])
        logger.warn(`Invalid permissions for user ${myPayload.aud}: expected ${expected}, found ${found}`)
        
        throw new InvalidPermissions(`Invalid permissions`)
    }
    
    return myPayload
}