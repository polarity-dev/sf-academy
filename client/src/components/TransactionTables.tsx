import React, { ReactFragment } from 'react'
import { Transaction } from './Transaction'

interface Props {
   transactionsList: Array<{
      usdDelta: number,
      eurDelta: number,
      timestamp: string,
      type: string
   }>
}

export const TransactionsTable: React.FC<Props> = ({ transactionsList }) => {
   const rows: ReactFragment = transactionsList.map(transaction => 
      <Transaction data={transaction} />
   )

   return (
      <table>
         <thead>
            <tr>
               <th>Type</th>
               <th>Eur</th>
               <th>Usd</th>
               <th>Time</th>
            </tr>
         </thead>
         <tbody>
            {rows}
         </tbody>
      </table>
   )
}
