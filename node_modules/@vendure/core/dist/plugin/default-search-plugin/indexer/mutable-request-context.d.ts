import { CurrencyCode } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext, SerializedRequestContext } from '../../../api/common/request-context';
import { Channel } from '../../../entity/channel/channel.entity';
/**
 * @description
 * This is used during search index creation to allow us to use a single
 * RequestContext, but mutate the Channel. In this way, we can take
 * full advantage of the RequestContextCacheService, and _massively_ cut
 * down on the number of DB calls being made during indexing.
 */
export declare class MutableRequestContext extends RequestContext {
    constructor(options: ConstructorParameters<typeof RequestContext>[0]);
    private mutatedChannel;
    setChannel(channel: Channel): void;
    get channel(): Channel;
    get channelId(): ID;
    get currencyCode(): CurrencyCode;
    static deserialize(ctxObject: SerializedRequestContext): MutableRequestContext;
}
