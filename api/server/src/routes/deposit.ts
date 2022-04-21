import usersClient from "../../../grpcClients/usersClient";
import { ServiceError } from "@grpc/grpc-js";
import { NextFunction, Request, Response } from "express";
import { DepositResponse__Output } from "../../../proto/usersPackage/DepositResponse";
import { decode, JwtPayload } from "jsonwebtoken";

const deposit = (req: Request, res: Response, next: NextFunction) => {
	const { value, symbol } = req.body;
	const token: string = req.headers.authorization?.replace(
		"Bearer ",
		""
	) as string;
	const userId = (decode(token) as JwtPayload).userId;
	usersClient.Deposit(
		{
			userId,
			value,
			symbol,
		},
		(err: ServiceError | null, data: DepositResponse__Output | undefined) => {
			if (err) {
				next(err);
				return;
			}
			res.status(201).send(data?.transaction);
		}
	);
};

export default deposit;
