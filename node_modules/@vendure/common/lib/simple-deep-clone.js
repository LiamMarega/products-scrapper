"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleDeepClone = simpleDeepClone;
const shared_utils_1 = require("./shared-utils");
/**
 * An extremely fast function for deep-cloning an object which only contains simple
 * values, i.e. primitives, arrays and nested simple objects.
 */
function simpleDeepClone(input) {
    // if not array or object or is null return self
    if (typeof input !== 'object' || input === null) {
        return input;
    }
    let output;
    let i;
    // handle case: array
    if (input instanceof Array) {
        let l;
        output = [];
        for (i = 0, l = input.length; i < l; i++) {
            output[i] = simpleDeepClone(input[i]);
        }
        return output;
    }
    if ((0, shared_utils_1.isClassInstance)(input)) {
        return input;
    }
    // handle case: object
    output = {};
    for (i in input) {
        if (input.hasOwnProperty(i)) {
            output[i] = simpleDeepClone(input[i]);
        }
    }
    return output;
}
//# sourceMappingURL=simple-deep-clone.js.map