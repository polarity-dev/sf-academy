import { CreateOptions, UniqueConstraintError } from "sequelize";
import { EmailAlreadyPresent, InternalError } from "../utils/errors";
import { createBankAccount } from "./bank_account_operations";
import connection, { BankAccount, User } from "./connection";
import { bank_accounts } from "../models/bank_accounts";
import { users, usersCreationAttributes } from "../models/users";
import { compare } from "bcrypt";

/**
 * Find a user by an email and a password
 * @param email 
 * @param passwd 
 * @returns a user if it matches the given credentials. Every bank account relative to the user is injected.
 */
export const findUserByCredentials = async (
    email: string, 
    passwd: string
): Promise<users | null> => {
    // Look for the user
    const user = await User.findOne({ 
        where: { email: email } , 
        include: { model: BankAccount, as: 'bank_accounts'}
    })
    const match = (user && await compare(passwd.trim(), user.passwd.trim()))
    return match
        ? user
        : null
}

/**
 * Find a user and include his bank accounts
 * @param id 
 * @returns a user
 */
export const findUserById = (id: number): Promise<users | null> =>
    User.findByPk(id, {
        include: { model: BankAccount, as: 'bank_accounts'}
    })

/**
 * Find a user and include his bank accounts
 * @param fingerprint 
 * @returns a user
 */
export const findUserByFingerprint = (fingerprint: string): Promise<users | null> =>
    User.findOne({
        where: {fingerprint: fingerprint},
        include: { model: BankAccount, as: 'bank_accounts'}
    })

/**
 * Creates a user. Throw errors for unique constraint (email) violation.
 * @param email 
 * @param password 
 * @param name 
 * @param surname 
 * @param options 
 * @returns 
 */
export const registerUser = (
    email: string, 
    password: string, 
    name: string,
    surname: string,
    options?: CreateOptions<usersCreationAttributes>
): Promise<users> => 
    User.create({
        email: email,
        passwd: password,
        name: name,
        surname: surname,
    }, 
    options)
    .catch(err => {
        if(err instanceof UniqueConstraintError)    throw new EmailAlreadyPresent(`Invalid email: ${email} already exists`) 
        else {
            console.log(err)
            throw new InternalError(`Unknown Internal error`, err)
        }
    })

/**
 * Create both user and bank account and link one to another
 * if any error is raised, a complete rollback happens.
 * This way, if errors are raised between the creation of the two, both are deleted.
 * @param email 
 * @param password 
 * @param name 
 * @param surname 
 * @param iban 
 * @returns a tuple containing both user and bank account
 */
export const registerUserAndBankAccount = async(
    email: string, 
    password: string, 
    name: string,
    surname: string,
    iban: string   
): Promise<[users, bank_accounts]>=> 
    (await connection).transaction(async (t) => {
        // Create the user
        const user = await registerUser(email, password, name, surname, {
            transaction: t,
        })
        
        // Create the bank account and link to the user
        const bankAccount = await createBankAccount(iban, user, { transaction: t })
        user.bank_accounts = [bankAccount]
        const tuple: [users, bank_accounts] = [user, bankAccount]
        return tuple
    })