"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEntityIdStrategy = setEntityIdStrategy;
const typeorm_1 = require("typeorm");
const entity_id_decorator_1 = require("./entity-id.decorator");
function setEntityIdStrategy(entityIdStrategy, entities) {
    setBaseEntityIdType(entityIdStrategy);
    setEntityIdColumnTypes(entityIdStrategy, entities);
}
function setEntityIdColumnTypes(entityIdStrategy, entities) {
    const columnDataType = entityIdStrategy.primaryKeyType === 'increment' ? 'int' : 'varchar';
    for (const EntityCtor of entities) {
        const columnConfig = (0, entity_id_decorator_1.getIdColumnsFor)(EntityCtor);
        for (const { name, options, entity } of columnConfig) {
            (0, typeorm_1.Column)({
                type: columnDataType,
                nullable: (options && options.nullable) || false,
                primary: (options && options.primary) || false,
            })(entity, name);
        }
    }
}
function setBaseEntityIdType(entityIdStrategy) {
    const { entity, name } = (0, entity_id_decorator_1.getPrimaryGeneratedIdColumn)();
    (0, typeorm_1.PrimaryGeneratedColumn)(entityIdStrategy.primaryKeyType)(entity, name);
}
//# sourceMappingURL=set-entity-id-strategy.js.map