import { Orderable } from '../../../common/types/common-types';
import { VendureEntity } from '../../../entity/base/base.entity';
/**
 * Moves the target Orderable entity to the given index amongst its siblings.
 * Returns the siblings (including the target) which should then be
 * persisted to the database.
 */
export declare function moveToIndex<T extends Orderable & VendureEntity>(index: number, target: T, siblings: T[]): T[];
