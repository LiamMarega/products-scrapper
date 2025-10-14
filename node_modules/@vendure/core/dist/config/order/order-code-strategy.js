"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultOrderCodeStrategy = void 0;
const generate_public_id_1 = require("../../common/generate-public-id");
/**
 * @description
 * The default OrderCodeStrategy generates a random string consisting
 * of 16 uppercase letters and numbers.
 *
 * @docsCategory orders
 * @docsPage OrderCodeStrategy
 */
class DefaultOrderCodeStrategy {
    generate(ctx) {
        return (0, generate_public_id_1.generatePublicId)();
    }
}
exports.DefaultOrderCodeStrategy = DefaultOrderCodeStrategy;
//# sourceMappingURL=order-code-strategy.js.map