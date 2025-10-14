import { RequestContext } from '../../../api';
import { ConfigService } from '../../../config/config.service';
/**
 * This class is responsible for generating and verifying the tokens issued when new accounts are registered
 * or when a password reset is requested.
 */
export declare class VerificationTokenGenerator {
    private configService;
    constructor(configService: ConfigService);
    /**
     * Generates a verification token using the configured {@link VerificationTokenStrategy}.
     * @param ctx The RequestContext object.
     * @returns The generated token.
     */
    generateVerificationToken(ctx: RequestContext): Promise<string>;
    /**
     * Verifies a verification token using the configured {@link VerificationTokenStrategy}.
     * @param ctx The RequestContext object.
     * @param token The token to verify.
     * @returns `true` if the token is valid, `false` otherwise.
     */
    verifyVerificationToken(ctx: RequestContext, token: string): Promise<boolean>;
}
