"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeAuthenticationStrategy = exports.NATIVE_AUTH_STRATEGY_NAME = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const transactional_connection_1 = require("../../connection/transactional-connection");
const native_authentication_method_entity_1 = require("../../entity/authentication-method/native-authentication-method.entity");
const user_entity_1 = require("../../entity/user/user.entity");
exports.NATIVE_AUTH_STRATEGY_NAME = 'native';
/**
 * @description
 * This strategy implements a username/password credential-based authentication, with the credentials
 * being stored in the Vendure database. This is the default method of authentication, and it is advised
 * to keep it configured unless there is a specific reason not to.
 *
 * @docsCategory auth
 */
class NativeAuthenticationStrategy {
    constructor() {
        this.name = exports.NATIVE_AUTH_STRATEGY_NAME;
    }
    async init(injector) {
        this.connection = injector.get(transactional_connection_1.TransactionalConnection);
        // These are lazily-loaded to avoid a circular dependency
        const { PasswordCipher } = await import('../../service/helpers/password-cipher/password-cipher.js');
        const { UserService } = await import('../../service/services/user.service.js');
        this.passwordCipher = injector.get(PasswordCipher);
        this.userService = injector.get(UserService);
    }
    defineInputType() {
        return (0, graphql_tag_1.default) `
            input NativeAuthInput {
                username: String!
                password: String!
            }
        `;
    }
    async authenticate(ctx, data) {
        const user = await this.userService.getUserByEmailAddress(ctx, data.username);
        if (!user) {
            return false;
        }
        const passwordMatch = await this.verifyUserPassword(ctx, user.id, data.password);
        if (!passwordMatch) {
            return false;
        }
        return user;
    }
    /**
     * Verify the provided password against the one we have for the given user.
     */
    async verifyUserPassword(ctx, userId, password) {
        var _a, _b;
        const user = await this.connection.getRepository(ctx, user_entity_1.User).findOne({
            where: { id: userId },
            relations: ['authenticationMethods'],
        });
        if (!user) {
            return false;
        }
        const nativeAuthMethod = user.getNativeAuthenticationMethod(false);
        if (!nativeAuthMethod) {
            return false;
        }
        const pw = (_b = (_a = (await this.connection.getRepository(ctx, native_authentication_method_entity_1.NativeAuthenticationMethod).findOne({
            where: { id: nativeAuthMethod.id },
            select: ['passwordHash'],
        }))) === null || _a === void 0 ? void 0 : _a.passwordHash) !== null && _b !== void 0 ? _b : '';
        const passwordMatches = await this.passwordCipher.check(password, pw);
        if (!passwordMatches) {
            return false;
        }
        return true;
    }
}
exports.NativeAuthenticationStrategy = NativeAuthenticationStrategy;
//# sourceMappingURL=native-authentication-strategy.js.map