import { Request, Response } from "express"
import { Secret, sign } from "jsonwebtoken"
import { tokenSecret } from "../../../config"

const login = (req: Request, res: Response) => {
   const token: String = sign(
      { message: "empty" },
      tokenSecret as Secret,
      { expiresIn: "1d" }
   )
   res.status(201).send({ token })
}

export default login
