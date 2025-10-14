import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { OrderableAsset } from '../asset/orderable-asset.entity';
import { Product } from './product.entity';
export declare class ProductAsset extends OrderableAsset {
    constructor(input?: DeepPartial<ProductAsset>);
    productId: ID;
    product: Product;
}
