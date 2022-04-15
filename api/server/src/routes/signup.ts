import { NextFunction, Request, Response } from "express";

const signup = (req: Request, res: Response, next: NextFunction) => {
   const email: string = req.body.email as string
}