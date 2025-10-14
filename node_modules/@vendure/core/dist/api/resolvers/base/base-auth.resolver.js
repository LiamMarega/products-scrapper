"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAuthResolver = void 0;
const error_result_1 = require("../../../common/error/error-result");
const errors_1 = require("../../../common/error/errors");
const generated_graphql_shop_errors_1 = require("../../../common/error/generated-graphql-shop-errors");
const native_authentication_strategy_1 = require("../../../config/auth/native-authentication-strategy");
const vendure_logger_1 = require("../../../config/logger/vendure-logger");
const get_user_channels_permissions_1 = require("../../../service/helpers/utils/get-user-channels-permissions");
const extract_session_token_1 = require("../../common/extract-session-token");
const set_session_token_1 = require("../../common/set-session-token");
class BaseAuthResolver {
    constructor(authService, userService, administratorService, configService) {
        this.authService = authService;
        this.userService = userService;
        this.administratorService = administratorService;
        this.configService = configService;
    }
    /**
     * Attempts a login given the username and password of a user. If successful, returns
     * the user data and returns the token either in a cookie or in the response body.
     */
    async baseLogin(args, ctx, req, res) {
        return await this.authenticateAndCreateSession(ctx, {
            input: { [native_authentication_strategy_1.NATIVE_AUTH_STRATEGY_NAME]: args },
            rememberMe: args.rememberMe,
        }, req, res);
    }
    async logout(ctx, req, res) {
        const token = (0, extract_session_token_1.extractSessionToken)(req, this.configService.authOptions.tokenMethod);
        if (!token) {
            return { success: false };
        }
        await this.authService.destroyAuthenticatedSession(ctx, token);
        (0, set_session_token_1.setSessionToken)({
            req,
            res,
            authOptions: this.configService.authOptions,
            rememberMe: false,
            sessionToken: '',
        });
        return { success: true };
    }
    /**
     * Returns information about the current authenticated user.
     */
    async me(ctx, apiType) {
        const userId = ctx.activeUserId;
        if (!userId) {
            throw new errors_1.ForbiddenError(vendure_logger_1.LogLevel.Verbose);
        }
        if (apiType === 'admin') {
            const administrator = await this.administratorService.findOneByUserId(ctx, userId);
            if (!administrator) {
                throw new errors_1.ForbiddenError(vendure_logger_1.LogLevel.Verbose);
            }
        }
        const user = userId && (await this.userService.getUserById(ctx, userId));
        return user ? this.publiclyAccessibleUser(user) : null;
    }
    /**
     * Creates an authenticated session and sets the session token.
     */
    async authenticateAndCreateSession(ctx, args, req, res) {
        const [method, data] = Object.entries(args.input)[0];
        const { apiType } = ctx;
        const session = await this.authService.authenticate(ctx, apiType, method, data);
        if ((0, error_result_1.isGraphQlErrorResult)(session)) {
            return session;
        }
        if (apiType && apiType === 'admin') {
            const administrator = await this.administratorService.findOneByUserId(ctx, session.user.id);
            if (!administrator) {
                return new generated_graphql_shop_errors_1.InvalidCredentialsError({ authenticationError: '' });
            }
        }
        (0, set_session_token_1.setSessionToken)({
            req,
            res,
            authOptions: this.configService.authOptions,
            rememberMe: args.rememberMe || false,
            sessionToken: session.token,
        });
        return this.publiclyAccessibleUser(session.user);
    }
    /**
     * Updates the password of an existing User.
     */
    async updatePassword(ctx, currentPassword, newPassword) {
        const { activeUserId } = ctx;
        if (!activeUserId) {
            throw new errors_1.ForbiddenError();
        }
        return this.userService.updatePassword(ctx, activeUserId, currentPassword, newPassword);
    }
    /**
     * Exposes a subset of the User properties which we want to expose to the public API.
     */
    publiclyAccessibleUser(user) {
        return {
            id: user.id,
            identifier: user.identifier,
            channels: (0, get_user_channels_permissions_1.getUserChannelsPermissions)(user),
        };
    }
}
exports.BaseAuthResolver = BaseAuthResolver;
//# sourceMappingURL=base-auth.resolver.js.map