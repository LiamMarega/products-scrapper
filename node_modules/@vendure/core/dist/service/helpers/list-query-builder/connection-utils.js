"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumnMetadata = getColumnMetadata;
exports.getEntityAlias = getEntityAlias;
exports.escapeCalculatedColumnExpression = escapeCalculatedColumnExpression;
/**
 * @description
 * Returns TypeORM ColumnMetadata for the given entity type.
 */
function getColumnMetadata(connection, entity) {
    const metadata = connection.getMetadata(entity);
    const columns = metadata.columns;
    let translationColumns = [];
    const relations = metadata.relations;
    const translationRelation = relations.find(r => r.propertyName === 'translations');
    if (translationRelation) {
        const commonFields = [
            'id',
            'createdAt',
            'updatedAt',
            'languageCode',
        ];
        const translationMetadata = connection.getMetadata(translationRelation.type);
        translationColumns = translationColumns.concat(translationMetadata.columns.filter(c => !c.relationMetadata && !commonFields.includes(c.propertyName)));
    }
    const alias = metadata.name.toLowerCase();
    return { columns, translationColumns, alias };
}
function getEntityAlias(connection, entity) {
    return connection.getMetadata(entity).name.toLowerCase();
}
/**
 * @description
 * Escapes identifiers in an expression according to the current database driver.
 */
function escapeCalculatedColumnExpression(connection, expression) {
    return expression.replace(/\b([a-z]+[A-Z]\w+)\b/g, substring => connection.driver.escape(substring));
}
//# sourceMappingURL=connection-utils.js.map