import { DeepPartial } from '@vendure/common/lib/shared-types';
import { AuthenticationMethod } from './authentication-method.entity';
/**
 * @description
 * This is the default, built-in authentication method which uses a identifier (typically username or email address)
 * and password combination to authenticate a User.
 *
 * @docsCategory entities
 * @docsPage AuthenticationMethod
 */
export declare class NativeAuthenticationMethod extends AuthenticationMethod {
    constructor(input?: DeepPartial<NativeAuthenticationMethod>);
    identifier: string;
    passwordHash: string;
    verificationToken: string | null;
    passwordResetToken: string | null;
    /**
     * @description
     * A token issued when a User requests to change their identifier (typically
     * an email address)
     */
    identifierChangeToken: string | null;
    /**
     * @description
     * When a request has been made to change the User's identifier, the new identifier
     * will be stored here until it has been verified, after which it will
     * replace the current value of the `identifier` field.
     */
    pendingIdentifier: string | null;
}
