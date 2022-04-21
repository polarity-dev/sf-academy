import { Knex, knex } from "knex";
import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { DepositRequest } from "../../../proto/usersPackage/DepositRequest";
import { DepositResponse } from "../../../proto/usersPackage/DepositResponse";
import knexConfig from "../../../knexConfig";

const db: Knex = knex(knexConfig);

const Deposit = (
	call: ServerUnaryCall<DepositRequest, DepositResponse>,
	callback: sendUnaryData<DepositResponse>
): void => {
	const userId: string = call.request.userId as string;
	const usdDelta: number =
		call.request.symbol === "USD" ? (call.request.value as number) : 0;
	const eurDelta: number =
		call.request.symbol === "EUR" ? (call.request.value as number) : 0;
	const timestamp: string = new Date().toISOString();
	const type: string = "DEPOSIT";

	db("transactions")
		.insert({
			userId,
			usdDelta,
			eurDelta,
			timestamp,
			type: "DEPOSIT",
		})
		.then((data) => {
			db("users")
				.update({
					usdBalance: db.raw(`"usdBalance" + ${usdDelta}`),
					eurBalance: db.raw(`"eurBalance" + ${eurDelta}`),
				})
				.where("userId", userId)
				.then(() => {});
		})
		.then((data) =>
			callback(null, {
				transaction: { eurDelta, usdDelta, timestamp, type },
			})
		)
		.catch((err) => {
			callback({
				code: status.INTERNAL,
				message: "Failed insertion",
			});
		});
};

export default Deposit;
