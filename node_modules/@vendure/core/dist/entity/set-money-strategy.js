"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMoneyStrategy = setMoneyStrategy;
const typeorm_1 = require("typeorm");
const money_decorator_1 = require("./money.decorator");
function setMoneyStrategy(moneyStrategy, entities) {
    var _a;
    for (const EntityCtor of entities) {
        const columnConfig = (0, money_decorator_1.getMoneyColumnsFor)(EntityCtor);
        for (const { name, options, entity } of columnConfig) {
            (0, typeorm_1.Column)(Object.assign(Object.assign({}, moneyStrategy.moneyColumnOptions), { nullable: (_a = options === null || options === void 0 ? void 0 : options.nullable) !== null && _a !== void 0 ? _a : false, default: options === null || options === void 0 ? void 0 : options.default }))(entity, name);
        }
    }
}
//# sourceMappingURL=set-money-strategy.js.map