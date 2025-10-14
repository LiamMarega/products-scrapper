import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { OrderableAsset } from '../asset/orderable-asset.entity';
import { ProductVariant } from './product-variant.entity';
export declare class ProductVariantAsset extends OrderableAsset {
    constructor(input?: DeepPartial<ProductVariantAsset>);
    productVariantId: ID;
    productVariant: ProductVariant;
}
