"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomHttpHealthIndicator = exports.HttpHealthCheckStrategy = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const index_1 = require("@nestjs/terminus/dist/health-indicator/index");
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * @description
 * A {@link HealthCheckStrategy} used to check health by pinging a url. Internally it uses
 * the [NestJS HttpHealthIndicator](https://docs.nestjs.com/recipes/terminus#http-healthcheck).
 *
 * @example
 * ```ts
 * import { HttpHealthCheckStrategy, TypeORMHealthCheckStrategy } from '\@vendure/core';
 *
 * export const config = {
 *   // ...
 *   systemOptions: {
 *     healthChecks: [
 *       new TypeORMHealthCheckStrategy(),
 *       new HttpHealthCheckStrategy({ key: 'my-service', url: 'https://my-service.com' }),
 *     ]
 *   },
 * };
 * ```
 *
 * @docsCategory health-check
 */
class HttpHealthCheckStrategy {
    constructor(options) {
        this.options = options;
    }
    init(injector) {
        this.injector = injector;
    }
    getHealthIndicator() {
        const { key, url, timeout } = this.options;
        return async () => {
            const indicator = await this.injector.resolve(CustomHttpHealthIndicator);
            return indicator.pingCheck(key, url, timeout);
        };
    }
}
exports.HttpHealthCheckStrategy = HttpHealthCheckStrategy;
/**
 * A much simplified version of the Terminus Modules' `HttpHealthIndicator` which has no
 * dependency on the @nestjs/axios package.
 */
let CustomHttpHealthIndicator = class CustomHttpHealthIndicator extends index_1.HealthIndicator {
    /**
     * Prepares and throw a HealthCheckError
     *
     * @throws {HealthCheckError}
     */
    generateHttpError(key, error) {
        const response = {
            message: error.message,
        };
        if (error.response) {
            response.statusCode = error.response.status;
            response.statusText = error.response.statusText;
        }
        throw new terminus_1.HealthCheckError(error.message, this.getStatus(key, false, response));
    }
    async pingCheck(key, url, timeout) {
        let isHealthy = false;
        try {
            await (0, node_fetch_1.default)(url, { timeout });
            isHealthy = true;
        }
        catch (err) {
            this.generateHttpError(key, err);
        }
        return this.getStatus(key, isHealthy);
    }
};
exports.CustomHttpHealthIndicator = CustomHttpHealthIndicator;
exports.CustomHttpHealthIndicator = CustomHttpHealthIndicator = __decorate([
    (0, common_1.Injectable)({
        scope: common_1.Scope.TRANSIENT,
    })
], CustomHttpHealthIndicator);
//# sourceMappingURL=http-health-check-strategy.js.map