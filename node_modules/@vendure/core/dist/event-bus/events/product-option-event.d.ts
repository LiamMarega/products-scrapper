import { CreateGroupOptionInput, CreateProductOptionInput, UpdateProductOptionInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { ProductOption } from '../../entity';
import { VendureEntityEvent } from '../vendure-entity-event';
type ProductOptionInputTypes = CreateGroupOptionInput | CreateProductOptionInput | UpdateProductOptionInput | ID;
/**
 * @description
 * This event is fired whenever a {@link ProductOption} is added or updated.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export declare class ProductOptionEvent extends VendureEntityEvent<ProductOption, ProductOptionInputTypes> {
    constructor(ctx: RequestContext, entity: ProductOption, type: 'created' | 'updated' | 'deleted', input?: ProductOptionInputTypes);
}
export {};
