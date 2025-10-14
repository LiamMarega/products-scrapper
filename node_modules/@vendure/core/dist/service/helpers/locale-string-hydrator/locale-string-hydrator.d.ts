import { LanguageCode } from '@vendure/common/lib/generated-types';
import { RequestContext } from '../../../api/common/request-context';
import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { Translatable, TranslatableKeys } from '../../../common/types/locale-types';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { VendureEntity } from '../../../entity/base/base.entity';
import { TranslatorService } from '../translator/translator.service';
/**
 * This helper class is to be used in GraphQL entity resolvers, to resolve fields which depend on being
 * translated (i.e. the corresponding entity field is of type `LocaleString`).
 */
export declare class LocaleStringHydrator {
    private connection;
    private requestCache;
    private translator;
    constructor(connection: TransactionalConnection, requestCache: RequestContextCacheService, translator: TranslatorService);
    hydrateLocaleStringField<T extends VendureEntity & Translatable & {
        languageCode?: LanguageCode;
    }>(ctx: RequestContext, entity: T, fieldName: TranslatableKeys<T> | 'languageCode'): Promise<string>;
    /**
     * Takes a translatable entity and populates all the LocaleString fields
     * by fetching the translations from the database (they will be eagerly loaded).
     *
     * This method includes a caching optimization to prevent multiple DB calls when many
     * translatable fields are needed on the same entity in a resolver.
     */
    private hydrateLocaleStrings;
}
