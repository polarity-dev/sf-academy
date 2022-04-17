import axios from "axios"
import { baseUrl } from "./config"

const getToken = () => axios.post(baseUrl + "/login", {
   "email": "est@yahoo.couk",
   "password": "XEV22DZU5SO"
})
.then(res => res.data.token)

export default getToken