/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { email } from './email';

/**
 * Signup object
 */
export type Signup = {
    name?: string;
    password: string;
    surname?: string;
    email: email;
    iban: string;
};

