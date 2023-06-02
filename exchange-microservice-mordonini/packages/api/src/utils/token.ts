import { Request } from "express";

/**
 * Extract Bearer (JWT) token from a request header
 * @param req 
 * @returns token
 */
export const getBearerToken = (req: Request): string => req.headers.authorization?.split(' ')[1] || ''