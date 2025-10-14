import { Type } from '@vendure/common/lib/shared-types';
interface MoneyColumnOptions {
    default?: number;
    /** Whether the field is nullable. Defaults to false */
    nullable?: boolean;
}
interface MoneyColumnConfig {
    name: string;
    entity: any;
    options?: MoneyColumnOptions;
}
/**
 * @description
 * Use this decorator for any entity field that is storing a monetary value.
 * This allows the column type to be defined by the configured {@link MoneyStrategy}.
 *
 * @docsCategory money
 * @docsPage Money Decorator
 * @since 2.0.0
 */
export declare function Money(options?: MoneyColumnOptions): (entity: any, propertyName: string) => void;
/**
 * @description
 * Returns any columns on the entity which have been decorated with the {@link EntityId}
 * decorator.
 */
export declare function getMoneyColumnsFor(entityType: Type<any>): MoneyColumnConfig[];
export {};
