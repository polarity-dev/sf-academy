import { knex, Knex } from 'knex'
import knexConfig from '../knexConfig'

const createUsersTable = () => {
   const db: Knex = knex(knexConfig)
   return db.schema.hasTable("users")
   .catch(err => console.log(err))
   .then(exists => {if (exists) throw Error()})
   .then(() => db.schema.createTable("users", table => {
      table.increments("userId").primary()
      table.string("email").notNullable().unique()
      table.string("username").notNullable()
      table.string("password").notNullable()
      table.string("iban").notNullable()
      table.double("usdBalance").defaultTo(0)
      table.double("eurBalance").defaultTo(0)
      console.log("Table users created")
   }))
   .catch(() => console.log("Table users already exists"))
   .finally(() => db.destroy())
}

const createTransactionTable = () => {
   const db: Knex = knex(knexConfig)
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
   .finally(() => db.destroy())
}

const createTables = () => {
   return createUsersTable()
   .then(() => createTransactionTable())
}

export default createTables