import { StockMovementType } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { OrderLine } from '../order-line/order-line.entity';
import { StockMovement } from './stock-movement.entity';
/**
 * @description
 * A Release is created when OrderItems which have been allocated (but not yet fulfilled)
 * are cancelled.
 *
 * @docsCategory entities
 * @docsPage StockMovement
 */
export declare class Release extends StockMovement {
    readonly type = StockMovementType.RELEASE;
    constructor(input: DeepPartial<Release>);
    orderLine: OrderLine;
}
