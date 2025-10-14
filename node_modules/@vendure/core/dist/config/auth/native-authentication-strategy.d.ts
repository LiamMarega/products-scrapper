import { ID } from '@vendure/common/lib/shared-types';
import { DocumentNode } from 'graphql';
import { RequestContext } from '../../api/common/request-context';
import { Injector } from '../../common/injector';
import { User } from '../../entity/user/user.entity';
import { AuthenticationStrategy } from './authentication-strategy';
export interface NativeAuthenticationData {
    username: string;
    password: string;
}
export declare const NATIVE_AUTH_STRATEGY_NAME = "native";
/**
 * @description
 * This strategy implements a username/password credential-based authentication, with the credentials
 * being stored in the Vendure database. This is the default method of authentication, and it is advised
 * to keep it configured unless there is a specific reason not to.
 *
 * @docsCategory auth
 */
export declare class NativeAuthenticationStrategy implements AuthenticationStrategy<NativeAuthenticationData> {
    readonly name = "native";
    private connection;
    private passwordCipher;
    private userService;
    init(injector: Injector): Promise<void>;
    defineInputType(): DocumentNode;
    authenticate(ctx: RequestContext, data: NativeAuthenticationData): Promise<User | false>;
    /**
     * Verify the provided password against the one we have for the given user.
     */
    verifyUserPassword(ctx: RequestContext, userId: ID, password: string): Promise<boolean>;
}
