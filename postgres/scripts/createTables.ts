import { Knex } from 'knex'

const createUsersTable = async (db: Knex) => {
   return db.schema.hasTable("users")
   .catch(err => console.log(err))
   .then(exists => {if (exists) throw Error()})
   .then(() => db.schema.createTable("users", table => {
      table.increments("userId").primary()
      table.string("email").notNullable().unique()
      table.string("username").notNullable()
      table.string("password").notNullable()
      table.string("iban").notNullable()
      console.log("Table users created")
   }))
   .catch(() => console.log("Table users already exists"))
}

const createTransactionTable = async (db: Knex) => {
   return db.schema.hasTable("transactions")
   .catch(err => console.log(err))
   .then(exists => {if (exists) throw Error()})
   .then(() => db.schema.createTable("transactions", table => {
      table.increments("transactionId").primary()
      table.integer("userId").notNullable()
      table.double("usdDelta").notNullable()
      table.double("eurDelta").notNullable()
      table.datetime("timestamp").notNullable()
      console.log("Table transactions created")
   }))
   .catch(() => console.log("Table transactions already exists"))
}

const createTables = async (db: Knex) => {
   return createUsersTable(db)
   .then(() => createTransactionTable(db))
}

export default createTables