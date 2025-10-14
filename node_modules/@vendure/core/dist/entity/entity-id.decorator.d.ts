import { Type } from '@vendure/common/lib/shared-types';
interface IdColumnOptions {
    /** Whether the field is nullable. Defaults to false */
    nullable?: boolean;
    /** Whether this is a primary key. Defaults to false */
    primary?: boolean;
}
interface IdColumnConfig {
    name: string;
    entity: any;
    options?: IdColumnOptions;
}
/**
 * Decorates a property which should be marked as a generated primary key.
 * Designed to be applied to the VendureEntity id property.
 */
export declare function PrimaryGeneratedId(): (entity: any, propertyName: string) => void;
/**
 * @description
 * Decorates a property which points to another entity by ID. This custom decorator is needed
 * because we do not know the data type of the ID column until runtime, when we have access
 * to the configured EntityIdStrategy.
 *
 * @docsCategory configuration
 * @docsPage EntityId Decorator
 */
export declare function EntityId(options?: IdColumnOptions): (entity: any, propertyName: string) => void;
/**
 * Returns any columns on the entity which have been decorated with the {@link EntityId}
 * decorator.
 */
export declare function getIdColumnsFor(entityType: Type<any>): IdColumnConfig[];
/**
 * Returns the entity and property name that was decorated with the {@link PrimaryGeneratedId}
 * decorator.
 */
export declare function getPrimaryGeneratedIdColumn(): {
    entity: any;
    name: string;
};
export {};
