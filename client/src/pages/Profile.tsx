import axios, { AxiosError, AxiosResponse, AxiosResponseHeaders, AxiosResponseTransformer } from 'axios'
import React, { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { LinkButton } from '../components/LinkButton'

interface Props {
   token: string
}

const apiUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}/getUser`

export const Profile: React.FC<Props> = ({ token }) => {
   const [state, setState] = useState({
      email: "",
      username: "",
      iban: "",
      usdBalance: 0,
      eurBalance: 0
   })

   const navigate: NavigateFunction = useNavigate()

   useEffect(() => {
      console.log(token)
      axios.get(apiUrl, { headers: { Authorization: "Bearer " + token } })
      .then((res: AxiosResponse) => res.data)
      .then(data => {
         const { email, username, iban, usdBalance, eurBalance } = data
         setState({ email, username, iban, usdBalance, eurBalance })
      })
      .catch((err: AxiosError) => {
         alert(err.response?.data.message)
         navigate("/", { replace: true })
      })
   }, [])

   return (
      <>
      <h2>Hi, {state.username}!</h2>
      <p>Your current balance</p> <br/>
      <p>EUR {state.eurBalance.toFixed(2)}</p>
      <p>USD {state.usdBalance.toFixed(2)}</p>
      <LinkButton path="/Transactions" color="red" text="Transactions" />
      </>
   )
}
function componentDidMount(arg0: () => void) {
   throw new Error('Function not implemented.')
}

