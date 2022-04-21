import usersClient from "../../../grpcClients/usersClient";
import { ServiceError } from "@grpc/grpc-js";
import { NextFunction, Request, Response } from "express";
import { SignupResponse__Output } from "../../../proto/usersPackage/SignupResponse";

const signup = (req: Request, res: Response, next: NextFunction) => {
	const { username, email, password, iban } = req.body;
	usersClient.Signup(
		{
			username,
			email,
			password,
			iban,
		},
		(err: ServiceError | null, data: SignupResponse__Output | undefined) => {
			if (err) {
				next(err);
				return;
			}
			res.status(201).send(data);
		}
	);
};

export default signup;
