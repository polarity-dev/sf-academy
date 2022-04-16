import { apiHost, apiPort } from "./config"
import axios from "axios"

const URL = `http://${apiHost}:${apiPort}`

const usersData: Array<object> = [
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

usersData.forEach(user => {
   axios.post(URL + "/signup", user)
	.catch(() => {})
})
