import { AuthenticationResult, MutationAuthenticateArgs, MutationLoginArgs, MutationRefreshCustomerVerificationArgs, MutationRegisterCustomerAccountArgs, MutationRequestPasswordResetArgs, MutationRequestUpdateCustomerEmailAddressArgs, MutationResetPasswordArgs, MutationUpdateCustomerEmailAddressArgs, MutationUpdateCustomerPasswordArgs, MutationVerifyCustomerAccountArgs, NativeAuthenticationResult, RefreshCustomerVerificationResult, RegisterCustomerAccountResult, RequestPasswordResetResult, RequestUpdateCustomerEmailAddressResult, ResetPasswordResult, Success, UpdateCustomerEmailAddressResult, UpdateCustomerPasswordResult, VerifyCustomerAccountResult } from '@vendure/common/lib/generated-shop-types';
import { Request, Response } from 'express';
import { NativeAuthStrategyError } from '../../../common/error/generated-graphql-shop-errors';
import { ConfigService } from '../../../config/config.service';
import { AdministratorService } from '../../../service/services/administrator.service';
import { AuthService } from '../../../service/services/auth.service';
import { CustomerService } from '../../../service/services/customer.service';
import { HistoryService } from '../../../service/services/history.service';
import { UserService } from '../../../service/services/user.service';
import { RequestContext } from '../../common/request-context';
import { BaseAuthResolver } from '../base/base-auth.resolver';
export declare class ShopAuthResolver extends BaseAuthResolver {
    protected customerService: CustomerService;
    protected historyService: HistoryService;
    constructor(authService: AuthService, userService: UserService, administratorService: AdministratorService, configService: ConfigService, customerService: CustomerService, historyService: HistoryService);
    login(args: MutationLoginArgs, ctx: RequestContext, req: Request, res: Response): Promise<NativeAuthenticationResult>;
    authenticate(args: MutationAuthenticateArgs, ctx: RequestContext, req: Request, res: Response): Promise<AuthenticationResult>;
    logout(ctx: RequestContext, req: Request, res: Response): Promise<Success>;
    me(ctx: RequestContext): Promise<import("@vendure/common/lib/generated-types").CurrentUser | null>;
    registerCustomerAccount(ctx: RequestContext, args: MutationRegisterCustomerAccountArgs): Promise<RegisterCustomerAccountResult>;
    verifyCustomerAccount(ctx: RequestContext, args: MutationVerifyCustomerAccountArgs, req: Request, res: Response): Promise<VerifyCustomerAccountResult>;
    refreshCustomerVerification(ctx: RequestContext, args: MutationRefreshCustomerVerificationArgs): Promise<RefreshCustomerVerificationResult>;
    requestPasswordReset(ctx: RequestContext, args: MutationRequestPasswordResetArgs): Promise<RequestPasswordResetResult>;
    resetPassword(ctx: RequestContext, args: MutationResetPasswordArgs, req: Request, res: Response): Promise<ResetPasswordResult>;
    updateCustomerPassword(ctx: RequestContext, args: MutationUpdateCustomerPasswordArgs): Promise<UpdateCustomerPasswordResult>;
    requestUpdateCustomerEmailAddress(ctx: RequestContext, args: MutationRequestUpdateCustomerEmailAddressArgs): Promise<RequestUpdateCustomerEmailAddressResult>;
    updateCustomerEmailAddress(ctx: RequestContext, args: MutationUpdateCustomerEmailAddressArgs): Promise<UpdateCustomerEmailAddressResult>;
    protected requireNativeAuthStrategy(): NativeAuthStrategyError | undefined;
}
