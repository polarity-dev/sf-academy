import { Request, Response } from "express";

export const logoutUser = (req: Request, resp: Response) => {
    resp.status(200).send("Bellaaaa")
}

