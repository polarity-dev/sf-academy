import React, { ChangeEventHandler } from 'react'

interface Props {
  name: string
  title: string,
  placeholder: string,
  text: string,
  onChange: ChangeEventHandler<HTMLInputElement>,
  password?: boolean
}

export const Textfield: React.FC<Props> = ({ name, title, placeholder, text, password ,onChange }) => {
  return (
    <>
      <label>{title}</label>
      <input
        name={name}
        type={(password) ? 'password' : 'text'}
        placeholder={placeholder}
        value={text}
        onChange={onChange}
      />
    </>
  )
}
