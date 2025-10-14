"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeConfig = mergeConfig;
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const simple_deep_clone_1 = require("@vendure/common/lib/simple-deep-clone");
const safe_assign_1 = require("../common/safe-assign");
/**
 * @description
 * Performs a deep merge of two VendureConfig objects. Unlike `Object.assign()` the `target` object is
 * not mutated, instead the function returns a new object which is the result of deeply merging the
 * values of `source` into `target`.
 *
 * Arrays do not get merged, they are treated as a single value that will be replaced. So if merging the
 * `plugins` array, you must explicitly concatenate the array.
 *
 * @example
 * ```ts
 * const result = mergeConfig(defaultConfig, {
 *   assetOptions: {
 *     uploadMaxFileSize: 5000,
 *   },
 *   plugins: [
 *     ...defaultConfig.plugins,
 *     MyPlugin,
 *   ]
 * };
 * ```
 *
 * @docsCategory configuration
 */
function mergeConfig(target, source, depth = 0) {
    if (!source) {
        return target;
    }
    if (depth === 0) {
        target = (0, simple_deep_clone_1.simpleDeepClone)(target);
    }
    if ((0, shared_utils_1.isObject)(target) && (0, shared_utils_1.isObject)(source)) {
        for (const key in source) {
            // Guard against prototype pollution - block dangerous property names
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                continue;
            }
            if ((0, shared_utils_1.isObject)(source[key])) {
                if (!target[key]) {
                    (0, safe_assign_1.safeAssign)(target, key, {});
                }
                if (!(0, shared_utils_1.isClassInstance)(source[key])) {
                    mergeConfig(target[key], source[key], depth + 1);
                }
                else {
                    (0, safe_assign_1.safeAssign)(target, key, source[key]);
                }
            }
            else {
                (0, safe_assign_1.safeAssign)(target, key, source[key]);
            }
        }
    }
    return target;
}
//# sourceMappingURL=merge-config.js.map