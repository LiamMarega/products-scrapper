import { Asset, FulfillmentLine, Order, OrderLine, ProductVariant } from '../../../entity';
import { AssetService, FulfillmentService, OrderService, ProductVariantService } from '../../../service';
import { RequestContext } from '../../common/request-context';
import { RelationPaths } from '../../decorators/relations.decorator';
export declare class OrderLineEntityResolver {
    private productVariantService;
    private assetService;
    private orderService;
    private fulfillmentService;
    constructor(productVariantService: ProductVariantService, assetService: AssetService, orderService: OrderService, fulfillmentService: FulfillmentService);
    productVariant(ctx: RequestContext, orderLine: OrderLine): Promise<ProductVariant>;
    featuredAsset(ctx: RequestContext, orderLine: OrderLine): Promise<Asset | undefined>;
    order(ctx: RequestContext, orderLine: OrderLine, relations: RelationPaths<Order>): Promise<Order | undefined>;
    fulfillmentLines(ctx: RequestContext, orderLine: OrderLine, relations: RelationPaths<Order>): Promise<FulfillmentLine[]>;
}
