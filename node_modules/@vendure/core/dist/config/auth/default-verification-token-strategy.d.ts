import { RequestContext } from '../../api/common/request-context';
import { Injector } from '../../common';
import { VerificationTokenStrategy } from './verification-token-strategy';
/**
 * @description
 * The default VerificationTokenStrategy which generates a token consisting of the
 * base64-encoded current time concatenated with a random id. The token is considered
 * valid if the current time is within the configured `verificationTokenDuration` of the
 * time encoded in the token.
 *
 * @docsCategory auth
 * @since 3.2.0
 */
export declare class DefaultVerificationTokenStrategy implements VerificationTokenStrategy {
    private configService;
    init(injector: Injector): void;
    /**
     * Generates a verification token which encodes the time of generation and concatenates it with a
     * random id.
     */
    generateVerificationToken(_ctx: RequestContext): string;
    /**
     * Checks the age of the verification token to see if it falls within the token duration
     * as specified in the VendureConfig.
     */
    verifyVerificationToken(_ctx: RequestContext, token: string): boolean;
}
