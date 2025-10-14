"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultVerificationTokenStrategy = void 0;
const ms_1 = __importDefault(require("ms"));
const generate_public_id_1 = require("../../common/generate-public-id");
const config_service_1 = require("../config.service");
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
class DefaultVerificationTokenStrategy {
    init(injector) {
        this.configService = injector.get(config_service_1.ConfigService);
    }
    /**
     * Generates a verification token which encodes the time of generation and concatenates it with a
     * random id.
     */
    generateVerificationToken(_ctx) {
        const now = new Date();
        const base64Now = Buffer.from(now.toJSON()).toString('base64');
        const id = (0, generate_public_id_1.generatePublicId)();
        return `${base64Now}_${id}`;
    }
    /**
     * Checks the age of the verification token to see if it falls within the token duration
     * as specified in the VendureConfig.
     */
    verifyVerificationToken(_ctx, token) {
        const { verificationTokenDuration } = this.configService.authOptions;
        const verificationTokenDurationInMs = typeof verificationTokenDuration === 'string'
            ? (0, ms_1.default)(verificationTokenDuration)
            : verificationTokenDuration;
        const [generatedOn] = token.split('_');
        const dateString = Buffer.from(generatedOn, 'base64').toString();
        const date = new Date(dateString);
        const elapsed = +new Date() - +date;
        return elapsed < verificationTokenDurationInMs;
    }
}
exports.DefaultVerificationTokenStrategy = DefaultVerificationTokenStrategy;
//# sourceMappingURL=default-verification-token-strategy.js.map