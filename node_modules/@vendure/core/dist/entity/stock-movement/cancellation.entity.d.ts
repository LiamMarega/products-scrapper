import { StockMovementType } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { OrderLine } from '../order-line/order-line.entity';
import { StockMovement } from './stock-movement.entity';
/**
 * @description
 * A Cancellation is created when OrderItems from a fulfilled Order are cancelled.
 *
 * @docsCategory entities
 * @docsPage StockMovement
 */
export declare class Cancellation extends StockMovement {
    readonly type = StockMovementType.CANCELLATION;
    constructor(input: DeepPartial<Cancellation>);
    orderLine: OrderLine;
}
