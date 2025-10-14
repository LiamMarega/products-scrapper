"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMoneyStrategy = void 0;
/**
 * @description
 * A {@link MoneyStrategy} that stores monetary values as a `int` type in the database.
 * The storage configuration and rounding logic replicates the behaviour of Vendure pre-2.0.
 *
 * @docsCategory money
 * @since 2.0.0
 */
class DefaultMoneyStrategy {
    constructor() {
        this.moneyColumnOptions = {
            type: 'int',
        };
        this.precision = 2;
    }
    round(value, quantity = 1) {
        return Math.round(value * quantity);
    }
}
exports.DefaultMoneyStrategy = DefaultMoneyStrategy;
//# sourceMappingURL=default-money-strategy.js.map