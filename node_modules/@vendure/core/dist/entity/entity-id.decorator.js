"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimaryGeneratedId = PrimaryGeneratedId;
exports.EntityId = EntityId;
exports.getIdColumnsFor = getIdColumnsFor;
exports.getPrimaryGeneratedIdColumn = getPrimaryGeneratedIdColumn;
const idColumnRegistry = new Map();
let primaryGeneratedColumn;
/**
 * Decorates a property which should be marked as a generated primary key.
 * Designed to be applied to the VendureEntity id property.
 */
function PrimaryGeneratedId() {
    return (entity, propertyName) => {
        primaryGeneratedColumn = {
            entity,
            name: propertyName,
        };
    };
}
/**
 * @description
 * Decorates a property which points to another entity by ID. This custom decorator is needed
 * because we do not know the data type of the ID column until runtime, when we have access
 * to the configured EntityIdStrategy.
 *
 * @docsCategory configuration
 * @docsPage EntityId Decorator
 */
function EntityId(options) {
    return (entity, propertyName) => {
        const idColumns = idColumnRegistry.get(entity);
        const entry = { name: propertyName, entity, options };
        if (idColumns) {
            idColumns.push(entry);
        }
        else {
            idColumnRegistry.set(entity, [entry]);
        }
    };
}
/**
 * Returns any columns on the entity which have been decorated with the {@link EntityId}
 * decorator.
 */
function getIdColumnsFor(entityType) {
    const match = Array.from(idColumnRegistry.entries()).find(([entity, columns]) => entity.constructor === entityType);
    return match ? match[1] : [];
}
/**
 * Returns the entity and property name that was decorated with the {@link PrimaryGeneratedId}
 * decorator.
 */
function getPrimaryGeneratedIdColumn() {
    if (!primaryGeneratedColumn) {
        throw new Error('primaryGeneratedColumn is undefined. The base VendureEntity must have the @PrimaryGeneratedId() decorator set on its id property.');
    }
    return primaryGeneratedColumn;
}
//# sourceMappingURL=entity-id.decorator.js.map