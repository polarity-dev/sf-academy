import { Request, Response } from "express";
import { makeBuyRequest } from "../utils/request_helper";
import client from "../users-client/grpc_client";
import { handleError } from "../utils/errors";

export const buyTransactions = (req: Request, resp: Response) => {
    // Login request
    const buyRequest  = makeBuyRequest(req)
        
    // Send request
    client.buyCurrency(buyRequest, (error, remoteResponse) => {
        if(error)   handleError(error, req, resp)
        else        resp.json(remoteResponse.toObject())
    })
}