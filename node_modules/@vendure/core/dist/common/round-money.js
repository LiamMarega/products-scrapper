"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundMoney = roundMoney;
const config_helpers_1 = require("../config/config-helpers");
let moneyStrategy;
/**
 * @description
 * Rounds a monetary value according to the configured {@link MoneyStrategy}.
 *
 * @docsCategory money
 * @since 2.0.0
 */
function roundMoney(value, quantity = 1) {
    if (!moneyStrategy) {
        moneyStrategy = (0, config_helpers_1.getConfig)().entityOptions.moneyStrategy;
    }
    return moneyStrategy.round(value, quantity);
}
//# sourceMappingURL=round-money.js.map