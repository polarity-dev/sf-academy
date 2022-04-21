import exchangeClient from "../../../grpcClients/exchangeClient";
import { NextFunction, Request, Response } from "express";
import { ServiceError } from "@grpc/grpc-js";
import { ExchangeResponse__Output } from "../../../proto/exchangePackage/ExchangeResponse";

const exchange = (req: Request, res: Response, next: NextFunction) => {
	const value: number = parseFloat(req.query.value as string);
	const from: string = req.query.from as string;
	const to: string = req.query.to as string;
	exchangeClient.Exchange(
		{ value, from, to },
		(
			err: ServiceError | null,
			data: ExchangeResponse__Output | undefined
		) => {
			if (err) {
				next(err);
				return;
			}
			res.status(200).send(data);
		}
	);
};

export default exchange;
