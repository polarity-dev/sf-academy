import React from "react"
import react from "react"
import { Link } from "react-router-dom"
import { Button } from "./Button"

interface Props {
   path: string,
   text: string,
   color?: string,
   className?: string
}

export const LinkButton: React.FC<Props> = ({ text, color, path, className }) => {
   return (
      <Link to={path}>
         <Button
         className={className || "btn"}
         text={text}
         color={color}
         />
      </Link>
   )
}