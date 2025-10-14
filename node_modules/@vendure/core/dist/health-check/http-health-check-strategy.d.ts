import { HealthIndicatorFunction, HealthIndicatorResult } from '@nestjs/terminus';
import { HealthIndicator } from '@nestjs/terminus/dist/health-indicator/index';
import { Injector } from '../common/injector';
import { HealthCheckStrategy } from '../config/system/health-check-strategy';
export interface HttpHealthCheckOptions {
    key: string;
    url: string;
    timeout?: number;
}
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
export declare class HttpHealthCheckStrategy implements HealthCheckStrategy {
    private options;
    constructor(options: HttpHealthCheckOptions);
    private injector;
    init(injector: Injector): void;
    getHealthIndicator(): HealthIndicatorFunction;
}
/**
 * A much simplified version of the Terminus Modules' `HttpHealthIndicator` which has no
 * dependency on the @nestjs/axios package.
 */
export declare class CustomHttpHealthIndicator extends HealthIndicator {
    /**
     * Prepares and throw a HealthCheckError
     *
     * @throws {HealthCheckError}
     */
    private generateHttpError;
    pingCheck(key: string, url: string, timeout?: number): Promise<HealthIndicatorResult>;
}
