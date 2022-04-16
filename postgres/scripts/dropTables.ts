import { knex, Knex } from 'knex'
import knexConfig from '../knexConfig'

const dropUsersTable = () => {
   const db: Knex = knex(knexConfig)
   return db.schema.hasTable("users")
   .catch(err => console.log(err))
   .then(exists => {if (!exists) throw Error()})
   .then(() => db.schema.dropTable("users"))
   .then(() => console.log("Table users dropped"))
   .catch(e => console.log("Table users does not exist"))
   .finally(() => db.destroy())
}

const dropTransactionsTable = () => {
   const db: Knex = knex(knexConfig)
   return db.schema.hasTable("transactions")
   .catch(err => console.log(err))
   .then(exists => {if (!exists) throw Error()})
   .then(() => db.schema.dropTable("transactions"))
   .then(() => console.log("Table transactions dropped"))
   .catch(() => console.log("Table transactions does not exist"))
   .finally(() => db.destroy())
}

const dropTables = () => {
   return dropUsersTable()
   .then(() => dropTransactionsTable())
}

export default dropTables
