import { Knex, knex } from "knex";
import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { LoginRequest } from "../../../proto/usersPackage/LoginRequest";
import { LoginResponse } from "../../../proto/usersPackage/LoginResponse";
import { sign } from "jsonwebtoken";
import { tokenSecret } from "../../../config";
import knexConfig from "../../../knexConfig";
import { createHash } from "crypto";

const db: Knex = knex(knexConfig);

const Login = (
	call: ServerUnaryCall<LoginRequest, LoginResponse>,
	callback: sendUnaryData<LoginResponse>
): void => {
	db.select("userId", "password")
		.from("users")
		.where("email", call.request.email)
		.then((rows) => rows[0])
		.then((data) => {
			const { userId, password: dbPasswordHash } = data;
			const queryPasswordHash = createHash("sha256")
				.update(call.request.password as string)
				.digest("hex");

			if (queryPasswordHash !== dbPasswordHash) throw Error();

			const token = sign({ userId }, tokenSecret as string, {
				expiresIn: "1d",
			});
			callback(null, { token });
		})
		.catch((err) =>
			callback({
				code: status.UNAUTHENTICATED,
				message: "Invalid credentials",
			})
		);
};

export default Login;
