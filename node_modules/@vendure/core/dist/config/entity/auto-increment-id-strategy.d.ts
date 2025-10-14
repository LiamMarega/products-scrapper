import { EntityIdStrategy } from './entity-id-strategy';
/**
 * @description
 * An id strategy which uses auto-increment integers as primary keys
 * for all entities. This is the default strategy used by Vendure.
 *
 * @docsCategory configuration
 * @docsPage EntityIdStrategy
 */
export declare class AutoIncrementIdStrategy implements EntityIdStrategy<'increment'> {
    readonly primaryKeyType = "increment";
    decodeId(id: string): number;
    encodeId(primaryKey: number): string;
}
