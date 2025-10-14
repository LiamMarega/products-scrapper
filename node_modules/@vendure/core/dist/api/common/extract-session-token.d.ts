import { Request } from 'express';
import { AuthOptions } from '../../config/vendure-config';
/**
 * Get the session token from either the cookie or the Authorization header, depending
 * on the configured tokenMethod.
 */
export declare function extractSessionToken(req: Request, tokenMethod: Exclude<AuthOptions['tokenMethod'], undefined>): string | undefined;
