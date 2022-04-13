import { LoginRequest } from "../../../proto/usersPackage/LoginRequest"
import { LoginResponse } from "../../../proto/usersPackage/LoginResponse"
import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js"
import { sign } from "jsonwebtoken"
import { tokenSecret } from "../../../config"

const Login = (call: ServerUnaryCall<LoginRequest, LoginResponse>, callback: sendUnaryData<LoginResponse>): void => {
   const good = true
   if (good) {
      const userId = 12
      const token = sign(
         { userId },
         tokenSecret as string,
         { expiresIn: "1d" }
      )
      callback(null, { token })
   }
   else {
      callback({
         code: status.PERMISSION_DENIED,
         message: "Invalid credentials"
      })
   }
}

export default Login