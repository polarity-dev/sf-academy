/**
 * UserService wrapper
 */

import {
    UserAuthentication,
    AuthService,
    Signup,
    Login
} from '../openapi' 

const { loginUser, signupUser } = AuthService

/**
 * Service wrapper
 * @param login 
 * @returns 
 */
export const doLoginUser = async(login: Login): Promise<UserAuthentication> => loginUser(login)

/**
 * Service wrapper
 * @param req 
 * @returns 
 */
export const doSignupUser = (req: Signup): Promise<UserAuthentication> => signupUser(req)
