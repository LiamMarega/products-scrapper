"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeTransitionDefinitions = mergeTransitionDefinitions;
const simple_deep_clone_1 = require("@vendure/common/lib/simple-deep-clone");
/**
 * Merges two state machine Transitions definitions.
 */
function mergeTransitionDefinitions(a, b) {
    if (!b) {
        return a;
    }
    const merged = (0, simple_deep_clone_1.simpleDeepClone)(a);
    for (const k of Object.keys(b)) {
        const key = k;
        if (merged.hasOwnProperty(key)) {
            if (b[key].mergeStrategy === 'replace') {
                merged[key].to = b[key].to;
            }
            else {
                merged[key].to = merged[key].to.concat(b[key].to);
            }
        }
        else {
            merged[key] = b[key];
        }
    }
    return merged;
}
//# sourceMappingURL=merge-transition-definitions.js.map