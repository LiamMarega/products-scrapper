import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { I18nService } from '../../i18n/i18n.service';
/**
 * This plugin intercepts outgoing responses and translates any error messages into the
 * current request language.
 */
export declare class TranslateErrorsPlugin implements ApolloServerPlugin {
    private i18nService;
    constructor(i18nService: I18nService);
    requestDidStart(): Promise<GraphQLRequestListener<any>>;
}
