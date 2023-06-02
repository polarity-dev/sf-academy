//import { bank_accounts, registerUserAndBankAccount, users } from '../db';
import { SignupRequest, SignupResponse } from '../proto/services/users/v1/signup_pb';
import { isValidEmail, isValidPassword, createSignupResponse } from '../utils';
import { InvalidArgument } from '../utils/errors';
import { CallType, ProtoCatCall } from 'protocat';

import auth from '../auth';
import { registerUserAndBankAccount } from '../db/user_operations';
import { bank_accounts } from '../models/bank_accounts';
import { users } from '../models/users';

const doSignup = async(
    email: string,
    password: string,
    name: string,
    surname: string,
    iban: string
): Promise<[users, bank_accounts]> =>  registerUserAndBankAccount(
        email, 
        password, 
        name, 
        surname,
        iban
)

/**
 * Maps the external request into valid parameters 
 * for the service implementation and send results/errors to the recipient.
 * @param call 
 */
export const signup = async(
    call: ProtoCatCall<unknown, SignupRequest, SignupResponse, CallType.Unary>,
) => {
    const requestObject = call.request.toObject()
    const {
        email,
        password,
        name,
        surname,
        iban
    } = requestObject

    // Checking email and password
    if (!isValidEmail(email))   throw new InvalidArgument(`Invalid email: ${email}`)
    if (iban === '')            throw new InvalidArgument(`Invalid IBAN: null`)
    if (!isValidPassword(password)) throw new InvalidArgument(`Invalid password length: ${password.length} digits`)

    // Business logic
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, bankAccount] = await doSignup(email.trim(), password.trim(), name.trim(), surname.trim(), iban.trim())
    
    // Signup successfull
    // Generate auth token
    const token = await auth.generateAuthToken(user)
    
    // Response
    const protoSignupResponse = createSignupResponse(user, token)
    call.response.setUser(protoSignupResponse.getUser()).setToken(protoSignupResponse.getToken())
    
}
