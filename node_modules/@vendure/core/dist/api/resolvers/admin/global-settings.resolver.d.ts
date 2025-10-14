import { MutationUpdateGlobalSettingsArgs, ServerConfig, UpdateGlobalSettingsResult } from '@vendure/common/lib/generated-types';
import { GraphQLResolveInfo } from 'graphql';
import { ErrorResultUnion } from '../../../common/error/error-result';
import { ConfigService } from '../../../config/config.service';
import { GlobalSettings } from '../../../entity/global-settings/global-settings.entity';
import { ChannelService } from '../../../service/services/channel.service';
import { GlobalSettingsService } from '../../../service/services/global-settings.service';
import { OrderService } from '../../../service/services/order.service';
import { RequestContext } from '../../common/request-context';
export declare class GlobalSettingsResolver {
    private configService;
    private globalSettingsService;
    private channelService;
    private orderService;
    constructor(configService: ConfigService, globalSettingsService: GlobalSettingsService, channelService: ChannelService, orderService: OrderService);
    globalSettings(ctx: RequestContext): Promise<GlobalSettings>;
    /**
     * Exposes a subset of the VendureConfig which may be of use to clients.
     */
    serverConfig(info: GraphQLResolveInfo): ServerConfig;
    updateGlobalSettings(ctx: RequestContext, args: MutationUpdateGlobalSettingsArgs): Promise<ErrorResultUnion<UpdateGlobalSettingsResult, GlobalSettings>>;
    private generateCustomFieldConfig;
    private generateEntityCustomFieldConfig;
    private isRelationGraphQLType;
    private isStructGraphQLType;
    private isRelationConfigType;
    private isStructConfigType;
    private getScalarFieldsOfType;
    private getNamedType;
}
