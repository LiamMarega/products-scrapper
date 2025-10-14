"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omit = omit;
function omit(obj, keysToOmit, recursive = false) {
    if ((recursive && !isObject(obj)) || isFileObject(obj)) {
        return obj;
    }
    if (recursive && Array.isArray(obj)) {
        return obj.map((item) => omit(item, keysToOmit, true));
    }
    return Object.keys(obj).reduce((output, key) => {
        if (keysToOmit.includes(key)) {
            return output;
        }
        if (recursive) {
            return Object.assign(Object.assign({}, output), { [key]: omit(obj[key], keysToOmit, true) });
        }
        return Object.assign(Object.assign({}, output), { [key]: obj[key] });
    }, {});
}
function isObject(input) {
    return typeof input === 'object' && input !== null;
}
/**
 * When running in the Node environment, there is no native File object.
 */
function isFileObject(input) {
    if (typeof File === 'undefined') {
        return false;
    }
    else {
        return input instanceof File;
    }
}
//# sourceMappingURL=omit.js.map