"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdCodec = void 0;
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const ID_KEYS = ['id'];
/**
 * This service is responsible for encoding/decoding entity IDs according to the configured EntityIdStrategy.
 * It should only need to be used in resolvers - the design is that once a request hits the business logic layer
 * (ProductService etc) all entity IDs are in the form used as the primary key in the database.
 */
class IdCodec {
    constructor(entityIdStrategy) {
        this.entityIdStrategy = entityIdStrategy;
    }
    /**
     * Decode an id from the client into the format used as the database primary key.
     * Acts recursively on all objects containing an "id" property.
     *
     * @param target - The object to be decoded
     * @param transformKeys - An optional array of keys of the target to be decoded. If not defined,
     * then the default recursive behaviour will be used.
     * @return A decoded clone of the target
     */
    decode(target, transformKeys) {
        const transformKeysWithId = [...(transformKeys || []), ...ID_KEYS];
        return this.transformRecursive(target, input => this.entityIdStrategy.decodeId(input), transformKeysWithId);
    }
    /**
     * Encode any entity ids according to the encode.
     * Acts recursively on all objects containing an "id" property.
     *
     * @param target - The object to be encoded
     * @param transformKeys - An optional array of keys of the target to be encoded. If not defined,
     * then the default recursive behaviour will be used.
     * @return An encoded clone of the target
     */
    encode(target, transformKeys) {
        const transformKeysWithId = [...(transformKeys || []), ...ID_KEYS];
        return this.transformRecursive(target, input => this.entityIdStrategy.encodeId(input), transformKeysWithId);
    }
    transformRecursive(target, transformFn, transformKeys) {
        // noinspection SuspiciousInstanceOfGuard
        if (target == null ||
            typeof target === 'boolean' ||
            target instanceof Promise ||
            target instanceof Date ||
            target instanceof RegExp) {
            return target;
        }
        if (typeof target === 'string' || typeof target === 'number') {
            return transformFn(target);
        }
        if (Array.isArray(target)) {
            target = target.slice(0);
            if (target.length === 0 ||
                typeof target[0] === 'string' ||
                typeof target[0] === 'number' ||
                typeof target[0] === 'boolean' ||
                target[0] == null) {
                return target;
            }
            const isSimpleObject = this.isSimpleObject(target[0]);
            if (isSimpleObject) {
                const length = target.length;
                for (let i = 0; i < length; i++) {
                    target[i] = this.transform(target[i], transformFn, transformKeys);
                }
            }
            else {
                const length = target.length;
                for (let i = 0; i < length; i++) {
                    target[i] = this.transformRecursive(target[i], transformFn, transformKeys);
                }
            }
        }
        else {
            target = this.transform(target, transformFn, transformKeys);
            if ((0, shared_utils_1.isObject)(target)) {
                for (const key of Object.keys(target)) {
                    if (this.isObject(target[key])) {
                        target[key] = this.transformRecursive(target[key], transformFn, transformKeys);
                    }
                }
            }
        }
        return target;
    }
    transform(target, transformFn, transformKeys) {
        if (target == null || !this.isObject(target) || Array.isArray(target)) {
            return target;
        }
        const clone = Object.assign({}, target);
        if (transformKeys) {
            for (const key of transformKeys) {
                if (target[key]) {
                    const val = target[key];
                    if (Array.isArray(val)) {
                        clone[key] = val.map(v => transformFn(v));
                    }
                    else {
                        clone[key] = transformFn(val);
                    }
                }
            }
        }
        return clone;
    }
    isSimpleObject(target) {
        if (!target) {
            return true;
        }
        const values = Object.values(target);
        for (const value of values) {
            if (this.isObject(value) || value === null) {
                return false;
            }
        }
        return true;
    }
    isObject(target) {
        return typeof target === 'object' && target != null;
    }
}
exports.IdCodec = IdCodec;
//# sourceMappingURL=id-codec.js.map