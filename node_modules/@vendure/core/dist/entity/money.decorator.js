"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = Money;
exports.getMoneyColumnsFor = getMoneyColumnsFor;
const moneyColumnRegistry = new Map();
/**
 * @description
 * Use this decorator for any entity field that is storing a monetary value.
 * This allows the column type to be defined by the configured {@link MoneyStrategy}.
 *
 * @docsCategory money
 * @docsPage Money Decorator
 * @since 2.0.0
 */
function Money(options) {
    return (entity, propertyName) => {
        const idColumns = moneyColumnRegistry.get(entity);
        const entry = { name: propertyName, entity, options };
        if (idColumns) {
            idColumns.push(entry);
        }
        else {
            moneyColumnRegistry.set(entity, [entry]);
        }
    };
}
/**
 * @description
 * Returns any columns on the entity which have been decorated with the {@link EntityId}
 * decorator.
 */
function getMoneyColumnsFor(entityType) {
    const match = Array.from(moneyColumnRegistry.entries()).find(([entity, columns]) => entity.constructor === entityType);
    return match ? match[1] : [];
}
//# sourceMappingURL=money.decorator.js.map