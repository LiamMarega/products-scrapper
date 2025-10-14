import { Request, Response } from 'express';
import { AuthOptions } from '../../config/vendure-config';
/**
 * Sets the authToken either as a cookie or as a response header, depending on the
 * config settings.
 */
export declare function setSessionToken(options: {
    sessionToken: string;
    rememberMe: boolean;
    authOptions: Required<AuthOptions>;
    req: Request;
    res: Response;
}): void;
