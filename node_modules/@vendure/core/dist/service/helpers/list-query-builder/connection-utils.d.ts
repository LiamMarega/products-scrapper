import { Type } from '@vendure/common/lib/shared-types';
import { DataSource } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
/**
 * @description
 * Returns TypeORM ColumnMetadata for the given entity type.
 */
export declare function getColumnMetadata<T>(connection: DataSource, entity: Type<T>): {
    columns: ColumnMetadata[];
    translationColumns: ColumnMetadata[];
    alias: string;
};
export declare function getEntityAlias<T>(connection: DataSource, entity: Type<T>): string;
/**
 * @description
 * Escapes identifiers in an expression according to the current database driver.
 */
export declare function escapeCalculatedColumnExpression(connection: DataSource, expression: string): string;
