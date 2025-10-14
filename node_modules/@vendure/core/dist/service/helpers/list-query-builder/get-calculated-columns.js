"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalculatedColumns = getCalculatedColumns;
const calculated_decorator_1 = require("../../../common/calculated-decorator");
/**
 * @description
 * Returns calculated columns definitions for the given entity type.
 */
function getCalculatedColumns(entity) {
    const calculatedColumns = [];
    const prototype = entity.prototype;
    if (prototype.hasOwnProperty(calculated_decorator_1.CALCULATED_PROPERTIES)) {
        for (const property of prototype[calculated_decorator_1.CALCULATED_PROPERTIES]) {
            calculatedColumns.push(property);
        }
    }
    return calculatedColumns;
}
//# sourceMappingURL=get-calculated-columns.js.map