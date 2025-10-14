import { CurrencyCode, LanguageCode, Permission } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Request } from 'express';
import { GraphQLResolveInfo } from 'graphql';
import { ApiType } from '../../../api/common/get-api-type';
import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { CachedSession } from '../../../config/session-cache/session-cache-strategy';
import { Channel } from '../../../entity/channel/channel.entity';
import { User } from '../../../entity/user/user.entity';
import { ChannelService } from '../../services/channel.service';
/**
 * @description
 * Creates new {@link RequestContext} instances.
 *
 * @docsCategory request
 */
export declare class RequestContextService {
    private channelService;
    private configService;
    /** @internal */
    constructor(channelService: ChannelService, configService: ConfigService);
    /**
     * @description
     * Creates a RequestContext based on the config provided. This can be useful when interacting
     * with services outside the request-response cycle, for example in stand-alone scripts or in
     * worker jobs.
     *
     * @since 1.5.0
     */
    create(config: {
        req?: Request;
        apiType: ApiType;
        channelOrToken?: Channel | string;
        languageCode?: LanguageCode;
        currencyCode?: CurrencyCode;
        user?: User;
        activeOrderId?: ID;
    }): Promise<RequestContext>;
    /**
     * @description
     * Creates a new RequestContext based on an Express request object. This is used internally
     * in the API layer by the AuthGuard, and creates the RequestContext which is then passed
     * to all resolvers & controllers.
     */
    fromRequest(req: Request, info?: GraphQLResolveInfo, requiredPermissions?: Permission[], session?: CachedSession): Promise<RequestContext>;
    private getChannelToken;
    private getLanguageCode;
    private getCurrencyCode;
    /**
     * TODO: Deprecate and remove, since this function is now handled internally in the RequestContext.
     * @private
     */
    private userHasRequiredPermissionsOnChannel;
    /**
     * Returns true if any element of arr1 appears in arr2.
     */
    private arraysIntersect;
}
