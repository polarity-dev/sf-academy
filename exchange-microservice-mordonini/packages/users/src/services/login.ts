//import { findUserByCredentials, users } from "../db"

import { isValidEmail, isValidPassword, createLoginResponse } from "../utils"
import { InvalidArgument, InvalidCredentials } from "../utils/errors"
import { LoginRequest, LoginResponse } from "../proto/services/users/v1/login_pb"
import { ProtoCatCall, CallType } from "protocat"

import auth from '../auth'
import { findUserByCredentials } from "../db/user_operations"
import { users } from "../models/users"

export const doLogin = async(
    email: string, 
    password: string
): Promise<users> => {
    // Look for the user
    const user = await findUserByCredentials(email, password)
    if (!user)  throw new InvalidCredentials(`Invalid Username or Password`)
    return user
}

/**
 * Maps the external request into valid parameters 
 * for the service implementation and send results/errors to the recipient.
 * @param call 
 */
export const login = async (
    call: ProtoCatCall<unknown, LoginRequest, LoginResponse, CallType.Unary>
) => {
    const requestObject = call.request.toObject()
    const {email, password} = requestObject
    /**
     * We only check for the password to be short enought (hashing bottleneck)
     * and the email to be valid
    */
    if (!isValidPassword(password)) throw new InvalidArgument(`Invalid password length: ${password.length} digits`)
    
    if (!isValidEmail(email))   throw new InvalidArgument(`Invalid email: ${email}`)
    
    // Business Logic
    const user = await doLogin(email, password)
    
    // Gen. auth token
    const token = await auth.generateAuthToken(user)
    
    // Return result
    const protoLoginResponse = createLoginResponse(user, token)
    call.response.setToken(protoLoginResponse.getToken()).setUser(protoLoginResponse.getUser())
}
