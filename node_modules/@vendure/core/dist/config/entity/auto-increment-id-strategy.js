"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoIncrementIdStrategy = void 0;
/**
 * @description
 * An id strategy which uses auto-increment integers as primary keys
 * for all entities. This is the default strategy used by Vendure.
 *
 * @docsCategory configuration
 * @docsPage EntityIdStrategy
 */
class AutoIncrementIdStrategy {
    constructor() {
        this.primaryKeyType = 'increment';
    }
    decodeId(id) {
        const asNumber = +id;
        return Number.isNaN(asNumber) ? -1 : asNumber;
    }
    encodeId(primaryKey) {
        return primaryKey.toString();
    }
}
exports.AutoIncrementIdStrategy = AutoIncrementIdStrategy;
//# sourceMappingURL=auto-increment-id-strategy.js.map