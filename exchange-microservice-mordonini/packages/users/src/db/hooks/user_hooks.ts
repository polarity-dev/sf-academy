import { CreateOptions, UpdateOptions } from "sequelize";
import { InvalidArgument } from "../../utils/errors";
import { isValidPassword } from "../../utils/param_helper";
import { users, usersAttributes } from "../../models/users";
import { hash } from "bcrypt";

const SALT_ROUNDS = 10

export const hashUserPassword = async(
    user: users, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: UpdateOptions<usersAttributes> | CreateOptions<usersAttributes>
) => {
    if(!user.passwd)    return
    // Hashing algorithm that are bruteforce-safe are slow, meaning
    // that the password shouldn't be too long
    if(!isValidPassword(user.passwd))    throw new InvalidArgument(`Password too long`)

    // auto-generate salt and hash the password
    const hashedPasswd = await hash(user.passwd, SALT_ROUNDS) 
    // Store hashed passwd
    user.passwd = hashedPasswd
}