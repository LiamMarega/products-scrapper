"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecimalTransformer = void 0;
/**
 * Decimal types are returned as strings (e.g. "20.00") by some DBs, e.g. MySQL & Postgres
 */
class DecimalTransformer {
    to(value) {
        return value;
    }
    from(value) {
        return Number.parseFloat(value);
    }
}
exports.DecimalTransformer = DecimalTransformer;
//# sourceMappingURL=value-transformers.js.map