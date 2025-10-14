import { DeepPartial } from '@vendure/common/lib/shared-types';
import { User } from '../user/user.entity';
import { Session } from './session.entity';
/**
 * @description
 * An AuthenticatedSession is created upon successful authentication.
 *
 * @docsCategory entities
 */
export declare class AuthenticatedSession extends Session {
    constructor(input: DeepPartial<AuthenticatedSession>);
    /**
     * @description
     * The {@link User} who has authenticated to create this session.
     */
    user: User;
    /**
     * @description
     * The name of the {@link AuthenticationStrategy} used when authenticating
     * to create this session.
     */
    authenticationStrategy: string;
}
