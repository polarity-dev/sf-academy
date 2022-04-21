import { Knex, knex } from "knex";
import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { GetUserRequest } from "../../../proto/usersPackage/GetUserRequest";
import { GetUserResponse } from "../../../proto/usersPackage/GetUserResponse";
import knexConfig from "../../../knexConfig";

const db: Knex = knex(knexConfig);

const GetUser = (
	call: ServerUnaryCall<GetUserRequest, GetUserResponse>,
	callback: sendUnaryData<GetUserResponse>
): void => {
	const userId: string = call.request.userId as string;
	db("users")
		.select("email", "username", "iban", "usdBalance", "eurBalance")
		.where("userId", userId)
		.then((data) => data[0])
		.then((data) => callback(null, data))
		.catch((err) => {
			callback({
				code: status.INTERNAL,
				message: "Internal database error",
			});
		});
};

export default GetUser;
