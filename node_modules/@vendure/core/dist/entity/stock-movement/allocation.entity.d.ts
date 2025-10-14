import { StockMovementType } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { OrderLine } from '../order-line/order-line.entity';
import { StockMovement } from './stock-movement.entity';
/**
 * @description
 * An Allocation is created for each ProductVariant in an Order when the checkout is completed
 * (as configured by the {@link StockAllocationStrategy}. This prevents stock being sold twice.
 *
 * @docsCategory entities
 * @docsPage StockMovement
 */
export declare class Allocation extends StockMovement {
    readonly type = StockMovementType.ALLOCATION;
    constructor(input: DeepPartial<Allocation>);
    orderLine: OrderLine;
}
