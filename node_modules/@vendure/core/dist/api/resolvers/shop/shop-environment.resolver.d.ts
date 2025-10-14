import { Channel } from '../../../entity';
import { RequestContext } from '../../common/request-context';
export declare class ShopEnvironmentResolver {
    activeChannel(ctx: RequestContext): Promise<Channel>;
}
