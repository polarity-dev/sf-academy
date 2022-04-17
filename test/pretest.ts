import { baseUrl } from "./config"
import axios from "axios"

axios.post(baseUrl + "/signup", {
	"email": "est@yahoo.couk",
	"username": "Caleb Fletcher",
	"iban": "EE842136117487831855",
	"password": "XEV22DZU5SO"
})
.catch(() => {})
.then(() => {
	axios.post(baseUrl + "/signup", {
		"email": "in.nec@protonmail.com",
		"username": "Alma Gonzalez",
		"iban": "LU336614883400401499",
		"password": "CQH97TBJ4CU"
	})
	.catch(() => {})
})
.then(() => {
	axios.post(baseUrl + "/login", {
		"email": "est@yahoo.couk",
		"password": "XEV22DZU5SO"
	})
	.then(res => res.data.token)
	.then(token => {
		axios.post(baseUrl + "/deposit", {
			"symbol": "USD",
			"value": 400
		}, {
			headers: { "Authorization": "Bearer " + token }
		})
	})
})