import React from 'react'
import { Header } from '../components/Header'
import { LinkButton } from '../components/LinkButton'

interface Props {
   authenticated: boolean
}

export const Home: React.FC<Props> = ({ authenticated }) => {
   return (
      <>
      <Header title="Sf Academy" subtitle="A simple app to exchange USD and EUR" />
      { !authenticated && <LinkButton path="/login" text="Log In"/> }
      { !authenticated && <LinkButton path="/signup" text="Sign Up"/> }
      { authenticated && <LinkButton path="/profile" text="Profile" /> }
      </>
   )
}

