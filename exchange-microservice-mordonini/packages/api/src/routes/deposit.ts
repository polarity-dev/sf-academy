import { Request, Response } from "express";
import client from "../users-client/grpc_client";
import { handleError } from "../utils/errors";
import { makeDepositRequest } from "../utils/request_helper";

export const depositTransactions = (req: Request, resp: Response) => {
    // Login request
    const depositRequest  = makeDepositRequest(req)
        
    // Send request
    client.depositCurrency(depositRequest, (error, remoteResponse) => {
        if(error)   handleError(error, req, resp)
        else        resp.json(remoteResponse.toObject())
    })
}