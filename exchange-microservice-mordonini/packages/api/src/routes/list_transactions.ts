import { Request, Response } from "express";
import { makeListTransactionsRequest } from "../utils/request_helper";
import client from "../users-client/grpc_client";
import { handleError } from "../utils/errors";

export const listTransactions = (req: Request, resp: Response) => {
    const listTransactionsRequest = makeListTransactionsRequest(req)

    client.listTransactions(listTransactionsRequest, (error, remoteResponse) => {
        if(error)   handleError(error, req, resp)
        else        resp.json(remoteResponse.toObject())
    })
}