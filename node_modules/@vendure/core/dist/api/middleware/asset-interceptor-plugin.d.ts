import { ApolloServerPlugin, GraphQLRequestListener, GraphQLServerContext } from '@apollo/server';
import { ConfigService } from '../../config/config.service';
/**
 * Transforms outputs so that any Asset instances are run through the {@link AssetStorageStrategy.toAbsoluteUrl}
 * method before being returned in the response.
 */
export declare class AssetInterceptorPlugin implements ApolloServerPlugin {
    private configService;
    private graphqlValueTransformer;
    private readonly toAbsoluteUrl;
    constructor(configService: ConfigService);
    serverWillStart(service: GraphQLServerContext): Promise<void>;
    requestDidStart(): Promise<GraphQLRequestListener<any>>;
    private prefixAssetUrls;
    private isAssetType;
}
