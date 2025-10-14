import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChannelAware } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomStockLocationFields } from '../custom-entity-fields';
import { StockMovement } from '../stock-movement/stock-movement.entity';
/**
 * @description
 * A StockLocation represents a physical location where stock is held. For example, a warehouse or a shop.
 *
 * When the stock of a {@link ProductVariant} is adjusted, the adjustment is applied to a specific StockLocation,
 * and the stockOnHand of that ProductVariant is updated accordingly. When there are multiple StockLocations
 * configured, the {@link StockLocationStrategy} is used to determine which StockLocation should be used for
 * a given operation.
 *
 * @docsCategory entities
 */
export declare class StockLocation extends VendureEntity implements HasCustomFields, ChannelAware {
    constructor(input: DeepPartial<StockLocation>);
    name: string;
    description: string;
    customFields: CustomStockLocationFields;
    channels: Channel[];
    stockMovements: StockMovement[];
}
