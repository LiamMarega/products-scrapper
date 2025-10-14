import { DeletionResponse, MutationCreateSellerArgs, MutationDeleteSellerArgs, MutationDeleteSellersArgs, MutationUpdateSellerArgs, QuerySellerArgs, QuerySellersArgs, SellerList } from '@vendure/common/lib/generated-types';
import { Seller } from '../../../entity/seller/seller.entity';
import { SellerService } from '../../../service/services/seller.service';
import { RequestContext } from '../../common/request-context';
export declare class SellerResolver {
    private sellerService;
    constructor(sellerService: SellerService);
    sellers(ctx: RequestContext, args: QuerySellersArgs): Promise<SellerList>;
    seller(ctx: RequestContext, args: QuerySellerArgs): Promise<Seller | undefined>;
    createSeller(ctx: RequestContext, args: MutationCreateSellerArgs): Promise<Seller>;
    updateSeller(ctx: RequestContext, args: MutationUpdateSellerArgs): Promise<Seller>;
    deleteSeller(ctx: RequestContext, args: MutationDeleteSellerArgs): Promise<DeletionResponse>;
    deleteSellers(ctx: RequestContext, args: MutationDeleteSellersArgs): Promise<DeletionResponse[]>;
}
