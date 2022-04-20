import { createHash } from "crypto"
import { knex, Knex } from "knex"
import knexConfig from "../knexConfig"

const usersData = [
	{
		"email": "est@yahoo.couk",
		"username": "Caleb Fletcher",
		"iban": "EE842136117487831855",
		"password": "XEV22DZU5SO",
		"usdBalance": 164.97,
		"eurBalance": 130.36
	},
	{
		"email": "in.nec@protonmail.com",
		"username": "Alma Gonzalez",
		"iban": "LU336614883400401499",
		"password": "CQH97TBJ4CU",
		"usdBalance": 599.40,
		"eurBalance": 120.21
	},
	{
		"email": "et.netus@hotmail.org",
		"username": "Hayes Maynard",
		"iban": "MD3609114030974321782127",
		"password": "NLO37PVE9ZV",
		"usdBalance": 430.93,
		"eurBalance": 90.80
	},
	{
		"email": "et.lacinia@hotmail.edu",
		"username": "Jacqueline Russell",
		"iban": "AL90857048951769613376651487",
		"password": "CVF88FYY4RT",
		"usdBalance": 232.22,
		"eurBalance": 320.21
	}
]

const transactionsData = [
	{
		"usdDelta": 188.18,
		"eurDelta": 146.06,
		"timestamp": "2023-01-08 12:54:29",
		"userId": 4,
		"type": "BUY"
	},
	{
		"usdDelta": 10.94,
		"eurDelta": 185.80,
		"timestamp": "2021-10-18 09:55:35",
		"userId": 4,
		"type": "DEPOSIT"
	},
	{
		"usdDelta": 27.54,
		"eurDelta": 45.77,
		"timestamp": "2022-04-06 02:25:51",
		"userId": 1,
		"type": "WITHDRAW"
	},
	{
		"usdDelta": 175.45,
		"eurDelta": 162.16,
		"timestamp": "2021-09-04 17:24:28",
		"userId": 2,
		"type": "BUY"
	},
	{
		"usdDelta": 161.98,
		"eurDelta": 190.21,
		"timestamp": "2022-01-06 21:59:40",
		"userId": 1,
		"type": "WITHDRAW"
	}
]

const seedUsers = () => {
	const userInsertions: Array<Promise<void>> = []
	const db: Knex = knex(knexConfig)
   usersData.forEach(user => {
		user.password = createHash("sha256")
		.update(user.password)
		.digest("hex")
      userInsertions.push(db("users").insert(user))
   })
	return Promise.all(userInsertions)
	.then(() => console.log("Table users seeded"))
	.finally(() => db.destroy())
	.catch(() => {})
}

const seedTransactions = () => {
	const transactionInsertions: Array<Promise<void>> = []
	const db: Knex = knex(knexConfig)
	transactionsData.forEach(transaction => {
		transactionInsertions.push(db("transactions").insert(transaction))
	})
	return Promise.all(transactionInsertions)
	.then(() => console.log("Table transactions seeded"))
	.finally(() => db.destroy())
}

const seedTables = () => {
	return seedUsers()
	.then(() => seedTransactions())
	.catch(() => {})
}

export default seedTables