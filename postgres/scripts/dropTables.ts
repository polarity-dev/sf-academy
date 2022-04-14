import { Knex } from 'knex'

const dropUsersTable = async (db: Knex) => {
   return db.schema.hasTable("users")
   .catch(err => console.log(err))
   .then(exists => {if (!exists) throw Error()})
   .then(() => db.schema.dropTable("users"))
   .then(() => console.log("Table users dropped"))
   .catch(e => console.log("Table users does not exist"))
}

const dropTransactionsTable = async (db: Knex) => {
   return db.schema.hasTable("transactions")
   .catch(err => console.log(err))
   .then(exists => {if (!exists) throw Error()})
   .then(() => db.schema.dropTable("transactions"))
   .then(() => console.log("Table transactions dropped"))
   .catch(() => console.log("Table transactions does not exist"))
}

const dropTables = async (db: Knex) => {
   return dropUsersTable(db)
   .then(() => dropTransactionsTable(db))
}

export default dropTables
