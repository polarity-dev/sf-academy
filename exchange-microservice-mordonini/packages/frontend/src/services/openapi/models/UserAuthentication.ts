/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from './User';

/**
 * response containing authentication and user object
 */
export type UserAuthentication = {
    token: string;
    user: User;
};

