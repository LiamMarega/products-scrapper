import { Channel } from '../../../entity/channel/channel.entity';
import { Seller } from '../../../entity/seller/seller.entity';
import { SellerService } from '../../../service/services/seller.service';
import { RequestContext } from '../../common/request-context';
export declare class ChannelEntityResolver {
    private sellerService;
    constructor(sellerService: SellerService);
    seller(ctx: RequestContext, channel: Channel): Promise<Seller | undefined>;
    currencyCode(ctx: RequestContext, channel: Channel): string;
}
