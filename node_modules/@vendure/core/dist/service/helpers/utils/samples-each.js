"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.samplesEach = samplesEach;
/**
 * Returns true if and only if exactly one item from each
 * of the "groups" arrays appears in the "sample" array.
 */
function samplesEach(sample, groups) {
    if (sample.length !== groups.length) {
        return false;
    }
    return groups.every(group => {
        for (const item of sample) {
            if (group.includes(item)) {
                return true;
            }
        }
        return false;
    });
}
//# sourceMappingURL=samples-each.js.map