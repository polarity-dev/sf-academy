import { Request } from "express";
import { Secret, verify } from "jsonwebtoken";
import { tokenSecret } from "../config";

const verifyToken = (req: Request): boolean => {
	const token = req.headers.authorization?.replace("Bearer ", "") as string;
	try {
		verify(token, tokenSecret as Secret);
		return true;
	} catch (err) {
		throw { status: 401, message: "Invalid token" };
	}
};

export default verifyToken;
