"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCustomFieldsConfig = validateCustomFieldsConfig;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base/base.entity");
function validateCustomFieldsForEntity(entity, customFields) {
    return [
        ...assertValidFieldNames(entity.name, customFields),
        ...assertNoNameConflictsWithEntity(entity, customFields),
        ...assertNoDuplicatedCustomFieldNames(entity.name, customFields),
        ...assetNonNullablesHaveDefaults(entity.name, customFields),
        ...(isTranslatable(entity) ? [] : assertNoLocaleStringFields(entity.name, customFields)),
    ];
}
/**
 * Assert that the custom entity names are valid
 */
function assertValidFieldNames(entityName, customFields) {
    const errors = [];
    const validNameRe = /^[a-zA-Z_]+[a-zA-Z0-9_]*$/;
    for (const field of customFields) {
        if (!validNameRe.test(field.name)) {
            errors.push(`${entityName} entity has an invalid custom field name: "${field.name}"`);
        }
    }
    return errors;
}
function assertNoNameConflictsWithEntity(entity, customFields) {
    const errors = [];
    for (const field of customFields) {
        const conflicts = (e) => {
            return -1 < getAllColumnNames(e).findIndex(name => name === field.name);
        };
        const translation = getEntityTranslation(entity);
        if (conflicts(entity) || (translation && conflicts(translation))) {
            errors.push(`${entity.name} entity already has a field named "${field.name}"`);
        }
    }
    return errors;
}
/**
 * Assert that none of the custom field names conflict with one another.
 */
function assertNoDuplicatedCustomFieldNames(entityName, customFields) {
    const nameCounts = customFields
        .map(f => f.name)
        .reduce((hash, name) => {
        if (hash[name]) {
            hash[name]++;
        }
        else {
            hash[name] = 1;
        }
        return hash;
    }, {});
    return Object.entries(nameCounts)
        .filter(([name, count]) => 1 < count)
        .map(([name, count]) => `${entityName} entity has duplicated custom field name: "${name}"`);
}
/**
 * For entities which are not localized (Address, Customer), we assert that none of the custom fields
 * have a type "localeString".
 */
function assertNoLocaleStringFields(entityName, customFields) {
    if (!!customFields.find(f => f.type === 'localeString')) {
        return [`${entityName} entity does not support custom fields of type "localeString"`];
    }
    return [];
}
/**
 * Assert that any non-nullable field must have a defaultValue specified.
 */
function assetNonNullablesHaveDefaults(entityName, customFields) {
    const errors = [];
    for (const field of customFields) {
        if (field.nullable === false && field.defaultValue === undefined) {
            errors.push(`${entityName} entity custom field "${field.name}" is non-nullable and must have a defaultValue`);
        }
    }
    return errors;
}
function isTranslatable(entity) {
    return !!getEntityTranslation(entity);
}
function getEntityTranslation(entity) {
    const metadata = (0, typeorm_1.getMetadataArgsStorage)();
    const translation = metadata.filterRelations(entity).find(r => r.propertyName === 'translations');
    if (translation) {
        const type = translation.type;
        if (typeof type === 'function') {
            // See https://github.com/microsoft/TypeScript/issues/37663
            return type();
        }
    }
}
function getAllColumnNames(entity) {
    const metadata = (0, typeorm_1.getMetadataArgsStorage)();
    const ownColumns = metadata.filterColumns(entity);
    const relationColumns = metadata.filterRelations(entity);
    const embeddedColumns = metadata.filterEmbeddeds(entity);
    const baseColumns = metadata.filterColumns(base_entity_1.VendureEntity);
    return [...ownColumns, ...relationColumns, ...embeddedColumns, ...baseColumns].map(c => c.propertyName);
}
/**
 * Validates the custom fields config, e.g. by ensuring that there are no naming conflicts with the built-in fields
 * of each entity.
 */
function validateCustomFieldsConfig(customFieldConfig, entities) {
    let errors = [];
    (0, typeorm_1.getMetadataArgsStorage)();
    for (const key of Object.keys(customFieldConfig)) {
        const entityName = key;
        const customEntityFields = customFieldConfig[entityName] || [];
        const entity = entities.find(e => e.name === entityName);
        if (entity && customEntityFields.length) {
            errors = errors.concat(validateCustomFieldsForEntity(entity, customEntityFields));
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
//# sourceMappingURL=validate-custom-fields-config.js.map