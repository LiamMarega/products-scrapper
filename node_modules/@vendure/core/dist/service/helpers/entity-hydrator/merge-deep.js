"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDeep = mergeDeep;
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const safe_assign_1 = require("../../../common/safe-assign");
/**
 * Merges properties into a target entity. This is needed for the cases in which a
 * property already exists on the target, but the hydrated version also contains that
 * property with a different set of properties. This prevents the original target
 * entity from having data overwritten.
 */
function mergeDeep(a, b, visited = new WeakSet()) {
    var _c;
    if (!a) {
        return b;
    }
    // Prevent circular references
    if ((0, shared_utils_1.isObject)(b)) {
        if (visited.has(b)) {
            return a;
        }
        visited.add(b);
    }
    if (Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.length > 1) {
        if (a[0].hasOwnProperty('id')) {
            // If the array contains entities, we can use the id to match them up
            // so that we ensure that we don't merge properties from different entities
            // with the same index.
            const aIds = a.map(e => e.id);
            const bIds = b.map(e => e.id);
            if (JSON.stringify(aIds) !== JSON.stringify(bIds)) {
                // The entities in the arrays are not in the same order, so we can't
                // safely merge them. We need to sort the `b` array so that the entities
                // are in the same order as the `a` array.
                const idToIndexMap = new Map();
                a.forEach((item, index) => {
                    idToIndexMap.set(item.id, index);
                });
                b.sort((_a, _b) => {
                    return idToIndexMap.get(_a.id) - idToIndexMap.get(_b.id);
                });
            }
        }
    }
    for (const [key, value] of Object.entries(b)) {
        // Guard against prototype pollution - block dangerous property names
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            continue;
        }
        if ((_c = Object.getOwnPropertyDescriptor(b, key)) === null || _c === void 0 ? void 0 : _c.writable) {
            if (Array.isArray(value) || (0, shared_utils_1.isObject)(value)) {
                // Skip if we detect a circular reference
                if ((0, shared_utils_1.isObject)(value) && visited.has(value)) {
                    continue;
                }
                // Only merge recursively if the property exists as an own property in the destination object
                if (Object.prototype.hasOwnProperty.call(a, key) &&
                    (Array.isArray(a[key]) || (0, shared_utils_1.isObject)(a[key]))) {
                    const mergedValue = mergeDeep(a[key], b[key], visited);
                    (0, safe_assign_1.safeAssign)(a, key, mergedValue);
                }
                else {
                    (0, safe_assign_1.safeAssign)(a, key, value);
                }
            }
            else {
                (0, safe_assign_1.safeAssign)(a, key, value);
            }
        }
    }
    return a !== null && a !== void 0 ? a : b;
}
//# sourceMappingURL=merge-deep.js.map