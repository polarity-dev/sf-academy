import { Request, Response } from "express";
import { makeWithdrawRequest } from "../utils/request_helper";
import client from "../users-client/grpc_client";
import { handleError } from "../utils/errors";

export const withdrawTransactions = (req: Request, resp: Response) => {
    // Login request
    const withdrawRequest  = makeWithdrawRequest(req)
        
    // Send request
    client.withdrawCurrency(withdrawRequest, (error, remoteResponse) => {
        if(error)   handleError(error, req, resp)
        else        resp.json(remoteResponse.toObject())
    })
}