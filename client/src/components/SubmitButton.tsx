import React, { FormEventHandler } from 'react'

interface Props {
   color: string,
   text: string
}

export const SubmitButton: React.FC<Props> = ({ text, color }) => {
  return (
      <input
         type='submit'
         value={text}
         className='btn btn-block'
         style={{ backgroundColor: color }}
      />
  )
}

