"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UuidIdStrategy = void 0;
/**
 * @description
 * An id strategy which uses string uuids as primary keys
 * for all entities. This strategy can be configured with the
 * `entityIdStrategy` property of the `entityOptions` property
 * of {@link VendureConfig}.
 *
 * @example
 * ```ts
 * import { UuidIdStrategy, VendureConfig } from '\@vendure/core';
 *
 * export const config: VendureConfig = {
 *   entityOptions: {
 *     entityIdStrategy: new UuidIdStrategy(),
 *     // ...
 *   }
 * }
 * ```
 *
 * @docsCategory configuration
 * @docsPage EntityIdStrategy
 */
class UuidIdStrategy {
    constructor() {
        this.primaryKeyType = 'uuid';
    }
    decodeId(id) {
        return id;
    }
    encodeId(primaryKey) {
        return primaryKey;
    }
}
exports.UuidIdStrategy = UuidIdStrategy;
//# sourceMappingURL=uuid-id-strategy.js.map