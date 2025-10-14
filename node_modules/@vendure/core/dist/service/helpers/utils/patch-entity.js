"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchEntity = patchEntity;
/**
 * Updates only the specified properties from an Input object as long as the value is not
 * undefined. Null values can be passed, however, which will set the corresponding entity
 * field to "null". So care must be taken that this is only done on nullable fields.
 */
function patchEntity(entity, input) {
    for (const key of Object.keys(entity)) {
        const value = input[key];
        if (key === 'customFields' && value) {
            patchEntity(entity[key], value);
        }
        else if (value !== undefined && key !== 'id') {
            entity[key] = value;
        }
    }
    return entity;
}
//# sourceMappingURL=patch-entity.js.map