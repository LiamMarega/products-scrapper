import { ID } from '@vendure/common/lib/shared-types';
import { ApiType } from '../../api/common/get-api-type';
import { RequestContext } from '../../api/common/request-context';
import { InvalidCredentialsError } from '../../common/error/generated-graphql-admin-errors';
import { NotVerifiedError, InvalidCredentialsError as ShopInvalidCredentialsError } from '../../common/error/generated-graphql-shop-errors';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { AuthenticatedSession } from '../../entity/session/authenticated-session.entity';
import { User } from '../../entity/user/user.entity';
import { EventBus } from '../../event-bus/event-bus';
import { SessionService } from './session.service';
/**
 * @description
 * Contains methods relating to {@link Session}, {@link AuthenticatedSession} & {@link AnonymousSession} entities.
 *
 * @docsCategory services
 */
export declare class AuthService {
    private connection;
    private configService;
    private sessionService;
    private eventBus;
    constructor(connection: TransactionalConnection, configService: ConfigService, sessionService: SessionService, eventBus: EventBus);
    /**
     * @description
     * Authenticates a user's credentials and if okay, creates a new {@link AuthenticatedSession}.
     */
    authenticate(ctx: RequestContext, apiType: ApiType, authenticationMethod: string, authenticationData: any): Promise<AuthenticatedSession | InvalidCredentialsError | NotVerifiedError>;
    createAuthenticatedSessionForUser(ctx: RequestContext, user: User, authenticationStrategyName: string): Promise<AuthenticatedSession | NotVerifiedError>;
    /**
     * @description
     * Verify the provided password against the one we have for the given user. Requires
     * the {@link NativeAuthenticationStrategy} to be configured.
     */
    verifyUserPassword(ctx: RequestContext, userId: ID, password: string): Promise<boolean | InvalidCredentialsError | ShopInvalidCredentialsError>;
    /**
     * @description
     * Deletes all sessions for the user associated with the given session token.
     */
    destroyAuthenticatedSession(ctx: RequestContext, sessionToken: string): Promise<void>;
    private getAuthenticationStrategy;
}
