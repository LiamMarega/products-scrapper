import { AuthenticationResult, MutationAuthenticateArgs, MutationLoginArgs, NativeAuthenticationResult, Success } from '@vendure/common/lib/generated-types';
import { Request, Response } from 'express';
import { NativeAuthStrategyError } from '../../../common/error/generated-graphql-admin-errors';
import { ConfigService } from '../../../config/config.service';
import { AdministratorService } from '../../../service/services/administrator.service';
import { AuthService } from '../../../service/services/auth.service';
import { UserService } from '../../../service/services/user.service';
import { RequestContext } from '../../common/request-context';
import { BaseAuthResolver } from '../base/base-auth.resolver';
export declare class AuthResolver extends BaseAuthResolver {
    constructor(authService: AuthService, userService: UserService, configService: ConfigService, administratorService: AdministratorService);
    login(args: MutationLoginArgs, ctx: RequestContext, req: Request, res: Response): Promise<NativeAuthenticationResult>;
    authenticate(args: MutationAuthenticateArgs, ctx: RequestContext, req: Request, res: Response): Promise<AuthenticationResult>;
    logout(ctx: RequestContext, req: Request, res: Response): Promise<Success>;
    me(ctx: RequestContext): Promise<import("@vendure/common/lib/generated-types").CurrentUser | null>;
    protected requireNativeAuthStrategy(): NativeAuthStrategyError | undefined;
}
