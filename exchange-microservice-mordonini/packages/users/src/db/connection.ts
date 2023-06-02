import { Sequelize } from 'sequelize'
import { initModels } from '../models/init-models'
import currencies from '../models/currencies'
import { transaction_types } from '../models/transaction_types'

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT
} = process.env

export const getDBConnection = () => new Sequelize(
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,{
        logging: false,
    })


// Open connection
const sequelize: Sequelize = getDBConnection()

// Export opened connection
export default sequelize.authenticate().then(() => sequelize)


/* Export sequelize Models */
const {
    bank_accounts,
    transactions,
    users,
    wallets
} = initModels(sequelize)

export {
    bank_accounts as BankAccount,
    currencies as Currency,
    transaction_types as TransactionType,
    transactions as Transaction,
    users as User,
    wallets as Wallet
}