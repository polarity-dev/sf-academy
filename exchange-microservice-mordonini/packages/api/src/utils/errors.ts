import { Request, Response } from "express"

/**
 * Closest mapping between grpc and http status codes (https://chromium.googlesource.com/external/github.com/grpc/grpc/+/refs/tags/v1.21.4-pre1/doc/statuscodes.md)
 */
const grpcToHttpMap = [200, 499, 500, 400, 504, 404, 409, 403, 429, 400, 409, 400, 501, 500, 500, 503, 401]
/**
 * Maps grpc status code into http code 
 * @param grpcStatusCode grpc code
 * @returns http code
 */
export const grpcToHttpCode = (grpcStatusCode: number): number => grpcToHttpMap[grpcStatusCode]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleError = (error: any, req: Request, resp: Response) => {
    console.error(`Error: ${error.details}`)
    resp.status(grpcToHttpCode(error.code)).send(error.details)
}