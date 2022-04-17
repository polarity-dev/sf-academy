import axios from "axios"
import { apiPort, apiHost } from "./config"

const URL = `http://${apiHost}:${apiPort}`

const getToken = () => axios.post(URL + "/login", {
   "email": "est@yahoo.couk",
   "password": "XEV22DZU5SO"
})
.then(res => res.data.token)

export default getToken