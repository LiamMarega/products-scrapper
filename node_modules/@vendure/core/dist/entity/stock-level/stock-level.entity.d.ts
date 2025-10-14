import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomStockLevelFields } from '../custom-entity-fields';
import { ProductVariant } from '../product-variant/product-variant.entity';
import { StockLocation } from '../stock-location/stock-location.entity';
/**
 * @description
 * A StockLevel represents the number of a particular {@link ProductVariant} which are available
 * at a particular {@link StockLocation}.
 *
 * @docsCategory entities
 */
export declare class StockLevel extends VendureEntity implements HasCustomFields {
    constructor(input: DeepPartial<StockLevel>);
    productVariant: ProductVariant;
    productVariantId: ID;
    stockLocation: StockLocation;
    stockLocationId: ID;
    stockOnHand: number;
    stockAllocated: number;
    customFields: CustomStockLevelFields;
}
