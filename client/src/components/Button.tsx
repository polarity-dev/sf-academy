import React, { MouseEventHandler, useState } from "react"

interface Props {
   text: string,
   color?: string,
   onClick?: MouseEventHandler,
   className?: string
}

export const Button: React.FC<Props> = ({ className, color, text, onClick }) => {
   const [state, setState] = useState();
   return (
      <button
         className={className || "btn"}
         style={{backgroundColor: color || "deepSkyBlue"}}
         onClick={onClick}
         >
         {text}
      </button>
   )
}