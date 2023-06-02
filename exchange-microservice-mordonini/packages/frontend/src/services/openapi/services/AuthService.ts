/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Login } from '../models/Login';
import type { Signup } from '../models/Signup';
import type { UserAuthentication } from '../models/UserAuthentication';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * CORS support
     * Enable CORS by returning correct headers
     * @returns string Default response for CORS method
     * @throws ApiError
     */
    public static optionsAuthSignup(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'OPTIONS',
            url: '/auth/signup',
            responseHeader: 'Access-Control-Allow-Origin',
        });
    }

    /**
     * Create user
     * Create user
     * @param requestBody Signup request object
     * @returns UserAuthentication Successful authentication
     * @throws ApiError
     */
    public static signupUser(
        requestBody?: Signup,
    ): CancelablePromise<UserAuthentication> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/signup',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * CORS support
     * Enable CORS by returning correct headers
     * @returns string Default response for CORS method
     * @throws ApiError
     */
    public static optionsAuthLogin(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'OPTIONS',
            url: '/auth/login',
            responseHeader: 'Access-Control-Allow-Origin',
        });
    }

    /**
     * Logs user into the system
     * @param requestBody Login request object
     * @returns UserAuthentication Successful authentication
     * @throws ApiError
     */
    public static loginUser(
        requestBody?: Login,
    ): CancelablePromise<UserAuthentication> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
            },
        });
    }

}
