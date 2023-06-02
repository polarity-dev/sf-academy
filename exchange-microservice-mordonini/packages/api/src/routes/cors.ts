import { Request, Response } from "express";

export const handleCors = (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "*")
    res.header("Access-Control-Allow-Headers", "Origin, api_key, X-Requested-With, content-type, Accept, Authorization, Cache-Control")
    res.status(200).send()
}