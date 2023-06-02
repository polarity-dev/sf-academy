import { Request, Response } from "express";
import { makeSignupRequest } from "../utils/request_helper";
import client from "../users-client/grpc_client";
import { handleError } from "../utils/errors";

export const signupUser = (req: Request, resp: Response) => {
    const signupRequest = makeSignupRequest(req)
    
    client.signup(signupRequest, (error, remoteResponse) => {
        if(error)   handleError(error, req, resp)
        else        resp.json(remoteResponse.toObject())
    })
}