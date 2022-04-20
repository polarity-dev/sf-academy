import { Knex, knex } from "knex"
import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js"
import { SignupRequest } from "../../../proto/usersPackage/SignupRequest"
import { SignupResponse } from "../../../proto/usersPackage/SignupResponse"
import knexConfig from "../../../knexConfig"
import { createHash } from "crypto"
import { sign } from "jsonwebtoken"
import { tokenSecret } from "../../../config"

const db: Knex = knex(knexConfig)

const Signup = (call: ServerUnaryCall<SignupRequest, SignupResponse>, callback: sendUnaryData<SignupResponse>): void => {
   const { username, email, password, iban } = call.request
   const hash: string = createHash("sha256")
   .update(password as string)
   .digest("hex")
   db("users")
   .select("*")
   .where("email", email)
   .then(data => {
      if (data.length > 0) throw new Error()
      db("users")
      .insert({
         username,
         email,
         password: hash,
         iban,
         usdBalance: 0,
         eurBalance: 0
      })
      .then(() => callback(null, {}))
   })
   .catch(err => callback({
      code: status.ALREADY_EXISTS,
      message: "Email already taken"
   }))
}

export default Signup