import { Request, Response } from "express";
import client from '../users-client/grpc_client'
import { handleError } from "../utils/errors";
import { makeLoginRequest } from "../utils/request_helper";

export const loginUser = (req: Request, resp: Response) => {
    const loginRequest = makeLoginRequest(req)
    
    client.login(loginRequest, (error, remoteResponse) => {
        if(error)   handleError(error, req, resp)
        else        resp.json(remoteResponse.toObject())
    })
}