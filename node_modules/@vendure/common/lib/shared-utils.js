"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notNullOrUndefined = notNullOrUndefined;
exports.assertNever = assertNever;
exports.isObject = isObject;
exports.isClassInstance = isClassInstance;
exports.summate = summate;
exports.generateAllCombinations = generateAllCombinations;
exports.getGraphQlInputName = getGraphQlInputName;
/**
 * Predicate with type guard, used to filter out null or undefined values
 * in a filter operation.
 */
function notNullOrUndefined(val) {
    return val !== undefined && val !== null;
}
/**
 * Used in exhaustiveness checks to assert a codepath should never be reached.
 */
function assertNever(value) {
    throw new Error(`Expected never, got ${typeof value} (${JSON.stringify(value)})`);
}
/**
 * Simple object check.
 * From https://stackoverflow.com/a/34749873/772859
 */
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
function isClassInstance(item) {
    // Even if item is an object, it might not have a constructor as in the
    // case when it is a null-prototype object, i.e. created using `Object.create(null)`.
    return isObject(item) && item.constructor && item.constructor.name !== 'Object';
}
/**
 * Adds up all the values of a given numeric property of a list of objects.
 */
function summate(items, prop) {
    return (items || []).reduce((sum, i) => sum + i[prop], 0);
}
/**
 * Given an array of option arrays `[['red, 'blue'], ['small', 'large']]`, this method returns a new array
 * containing all the combinations of those options:
 *
 * @example
 * ```
 * generateAllCombinations([['red, 'blue'], ['small', 'large']]);
 * // =>
 * // [
 * //  ['red', 'small'],
 * //  ['red', 'large'],
 * //  ['blue', 'small'],
 * //  ['blue', 'large'],
 * // ]
 */
function generateAllCombinations(optionGroups, combination = [], k = 0, output = []) {
    if (k === 0) {
        optionGroups = optionGroups.filter(g => 0 < g.length);
    }
    if (k === optionGroups.length) {
        output.push(combination);
        return [];
    }
    else {
        /* eslint-disable @typescript-eslint/prefer-for-of */
        for (let i = 0; i < optionGroups[k].length; i++) {
            generateAllCombinations(optionGroups, combination.concat(optionGroups[k][i]), k + 1, output);
        }
        /* eslint-enable @typescript-eslint/prefer-for-of */
        return output;
    }
}
/**
 * @description
 * Returns the input field name of a custom field, taking into account that "relation" type custom
 * field inputs are suffixed with "Id" or "Ids".
 */
function getGraphQlInputName(config) {
    if (config.type === 'relation') {
        return config.list === true ? `${config.name}Ids` : `${config.name}Id`;
    }
    else {
        return config.name;
    }
}
//# sourceMappingURL=shared-utils.js.map