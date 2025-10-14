"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOptionsObjectToArray = findOptionsObjectToArray;
/**
 * Some internal APIs depend on the TypeORM FindOptions `relations` property being a string array.
 * This function converts the new-style FindOptionsRelations object to a string array.
 */
function findOptionsObjectToArray(input, parentKey) {
    if (Array.isArray(input)) {
        return input;
    }
    const keys = Object.keys(input);
    return keys.reduce((acc, key) => {
        const value = input[key];
        const path = parentKey ? `${parentKey}.${key}` : key;
        acc.push(path); // Push parent key instead of path
        if (typeof value === 'object' && value !== null) {
            const subKeys = findOptionsObjectToArray(value, path);
            acc.push(...subKeys);
        }
        return acc;
    }, []);
}
//# sourceMappingURL=find-options-object-to-array.js.map