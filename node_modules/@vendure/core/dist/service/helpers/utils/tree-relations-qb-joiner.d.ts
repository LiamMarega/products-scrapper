import { FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { VendureEntity } from '../../../entity';
/**
 * Dynamically joins tree relations and their eager counterparts in a TypeORM SelectQueryBuilder, addressing
 * challenges of managing deeply nested relations and optimizing query efficiency. It leverages TypeORM tree
 * decorators (@TreeParent, @TreeChildren) to automate joins of self-related entities, including those marked for eager loading.
 * The process avoids duplicate joins and manual join specifications by using relation metadata.
 *
 * @param {SelectQueryBuilder<T>} qb - The query builder instance for joining relations.
 * @param {EntityTarget<T>} entity - The target entity class or schema name, used to access entity metadata.
 * @param {string[]} [requestedRelations=[]] - An array of relation paths (e.g., 'parent.children') to join dynamically.
 * @param {number} [maxEagerDepth=1] - Limits the depth of eager relation joins to avoid excessively deep joins.
 * @returns {Map<string, string>} - A Map of joined relation paths to their aliases, aiding in tracking and preventing duplicates.
 * @template T - The entity type, extending VendureEntity for compatibility with Vendure's data layer.
 *
 * Usage Notes:
 * - Only entities utilizing TypeORM tree decorators and having nested relations are supported.
 * - The `maxEagerDepth` parameter controls the recursion depth for eager relations, preventing performance issues.
 *
 * For more context on the issue this function addresses, refer to TypeORM issue #9936:
 * https://github.com/typeorm/typeorm/issues/9936
 *
 * Example:
 * ```typescript
 * const qb = repository.createQueryBuilder("entity");
 * joinTreeRelationsDynamically(qb, EntityClass, ["parent.children"], 2);
 * ```
 */
export declare function joinTreeRelationsDynamically<T extends VendureEntity>(qb: SelectQueryBuilder<T>, entity: EntityTarget<T>, requestedRelations?: FindOneOptions['relations'], maxEagerDepth?: number): Map<string, string>;
