"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationTokenGenerator = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("../../../config/config.service");
/**
 * This class is responsible for generating and verifying the tokens issued when new accounts are registered
 * or when a password reset is requested.
 */
let VerificationTokenGenerator = class VerificationTokenGenerator {
    constructor(configService) {
        this.configService = configService;
    }
    /**
     * Generates a verification token using the configured {@link VerificationTokenStrategy}.
     * @param ctx The RequestContext object.
     * @returns The generated token.
     */
    async generateVerificationToken(ctx) {
        return this.configService.authOptions.verificationTokenStrategy.generateVerificationToken(ctx);
    }
    /**
     * Verifies a verification token using the configured {@link VerificationTokenStrategy}.
     * @param ctx The RequestContext object.
     * @param token The token to verify.
     * @returns `true` if the token is valid, `false` otherwise.
     */
    async verifyVerificationToken(ctx, token) {
        return this.configService.authOptions.verificationTokenStrategy.verifyVerificationToken(ctx, token);
    }
};
exports.VerificationTokenGenerator = VerificationTokenGenerator;
exports.VerificationTokenGenerator = VerificationTokenGenerator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], VerificationTokenGenerator);
//# sourceMappingURL=verification-token-generator.js.map