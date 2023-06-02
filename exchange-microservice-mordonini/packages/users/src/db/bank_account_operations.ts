import { IBANAlreadyPresent, InternalError } from "../utils/errors";
import { BankAccount, User } from "./connection";
import { bank_accounts, bank_accountsCreationAttributes } from "../models/bank_accounts";
import { users } from "../models/users";
import { CreateOptions, UniqueConstraintError } from "sequelize";

export const createBankAccount = (
    iban: string, 
    user: users,
    options?: CreateOptions<bank_accountsCreationAttributes>
): Promise<bank_accounts> => 
    BankAccount.create({
        iban: iban,
        user_id: user.id
    }, options)
    .catch(error => {
        if(error instanceof UniqueConstraintError)  throw new IBANAlreadyPresent(`Invalid IBAN: ${iban} already claimed`)
        else throw new InternalError("Unknown internal error")
    })

export const findAccountByIban = (iban:string): Promise<bank_accounts | null> =>
    BankAccount.findOne({
        where: {iban: iban},
        include: { model: User, as: 'user' }
    })

