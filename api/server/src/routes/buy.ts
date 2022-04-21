import usersClient from "../../../grpcClients/usersClient";
import { ServiceError } from "@grpc/grpc-js";
import { NextFunction, Request, Response } from "express";
import { BuyResponse__Output } from "../../../proto/usersPackage/BuyResponse";
import { decode, JwtPayload } from "jsonwebtoken";

const buy = (req: Request, res: Response, next: NextFunction) => {
	const { value, symbol } = req.body;
	const token: string = req.headers.authorization?.replace(
		"Bearer ",
		""
	) as string;
	const userId = (decode(token) as JwtPayload).userId;
	usersClient.Buy(
		{
			userId,
			value,
			symbol,
		},
		(err: ServiceError | null, data: BuyResponse__Output | undefined) => {
			if (err) {
				next(err);
				return;
			}
			res.status(201).send(data?.transaction);
		}
	);
};

export default buy;
