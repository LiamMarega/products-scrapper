"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORMHealthCheckStrategy = void 0;
const terminus_1 = require("@nestjs/terminus");
let indicator;
/**
 * @description
 * A {@link HealthCheckStrategy} used to check the health of the database. This health
 * check is included by default, but can be customized by explicitly adding it to the
 * `systemOptions.healthChecks` array:
 *
 * @example
 * ```ts
 * import { TypeORMHealthCheckStrategy } from '\@vendure/core';
 *
 * export const config = {
 *   // ...
 *   systemOptions: {
 *     healthChecks:[
 *         // The default key is "database" and the default timeout is 1000ms
 *         // Sometimes this is too short and leads to false negatives in the
 *         // /health endpoint.
 *         new TypeORMHealthCheckStrategy({ key: 'postgres-db', timeout: 5000 }),
 *     ]
 *   }
 * }
 * ```
 *
 * @docsCategory health-check
 */
class TypeORMHealthCheckStrategy {
    constructor(options) {
        this.options = options;
    }
    async init(injector) {
        indicator = await injector.resolve(terminus_1.TypeOrmHealthIndicator);
    }
    getHealthIndicator() {
        var _a, _b, _c;
        const key = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.key) || 'database';
        const timeout = (_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.timeout) !== null && _c !== void 0 ? _c : 1000;
        return () => indicator.pingCheck(key, { timeout });
    }
}
exports.TypeORMHealthCheckStrategy = TypeORMHealthCheckStrategy;
//# sourceMappingURL=typeorm-health-check-strategy.js.map