import { createHash } from "crypto"
import { Knex } from "knex"

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
	},
	{
		"email": "auctor.ullamcorper.nisl@yahoo.net",
		"username": "Scarlet Barber",
		"iban": "DO46761743751611624224758765",
		"password": "CAR48FPT9QL",
		"usdBalance": 264.88,
		"eurBalance": 120.81
	}
]

const transactionsData = [
	{
		"usdDelta": 188.18,
		"eurDelta": 146.06,
		"timestamp": "2023-01-08 12:54:29",
		"userId": 4
	},
	{
		"usdDelta": 10.94,
		"eurDelta": 185.80,
		"timestamp": "2021-10-18 09:55:35",
		"userId": 4
	},
	{
		"usdDelta": 27.54,
		"eurDelta": 45.77,
		"timestamp": "2022-04-06 02:25:51",
		"userId": 1
	},
	{
		"usdDelta": 175.45,
		"eurDelta": 162.16,
		"timestamp": "2021-09-04 17:24:28",
		"userId": 2
	},
	{
		"usdDelta": 161.98,
		"eurDelta": 190.21,
		"timestamp": "2022-01-06 21:59:40",
		"userId": 1
	}
]

const seedUsers = async (db: Knex) : Promise<void> => {
   usersData.forEach(async user => {
		user.password = createHash("sha256")
		.update(user.password)
		.digest("hex")
      await db("users").insert(user)
   })
	console.log("Table users seeded")
	return db.raw(";").catch()
}

const seedTransactions = (db: Knex) => {
	transactionsData.forEach(async transaction => {
		await db("transactions").insert(transaction)
	})
	console.log("Table transactions seeded")
	return db.raw(";").catch()
}

const seedTables = async (db: Knex) => {
	return seedUsers(db)
	.then(() => seedTransactions(db))
}

export default seedTables