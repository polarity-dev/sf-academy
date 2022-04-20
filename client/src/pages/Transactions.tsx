import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { Transaction } from '../components/Transaction'

interface Props {
   token: string
}

const apiUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}`

export const Transactions: React.FC<Props> = ({ token }) => {
   const [state, setState] = useState({
      transactionList: []
   })

   const navigate: NavigateFunction = useNavigate()

   useEffect(() => {
      axios.get(apiUrl + "/listTransactions", { headers: { Authorization: "Bearer " + token }})
      .then(res => res.data)
      .then(data => setState({...state, transactionList: data }))
      .catch((err: AxiosError) => {
         alert(err.response?.data.message)
         navigate("/", { replace: true })
      })
   }, [])

   const rows: React.ReactFragment = state.transactionList.map(transaction => 
      <Transaction data={transaction} />
   )

   return (
      <table>
         <thead>
            <tr>
               <th>Type</th>
               <th>Usd</th>
               <th>Eur</th>
               <th>Time</th>
            </tr>
         </thead>
         <tbody>
            {rows}
         </tbody>
      </table>
   )
}
