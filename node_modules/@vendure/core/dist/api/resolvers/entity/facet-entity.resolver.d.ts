import { FacetValueListOptions } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { Facet } from '../../../entity/facet/facet.entity';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { LocaleStringHydrator } from '../../../service/helpers/locale-string-hydrator/locale-string-hydrator';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { RequestContext } from '../../common/request-context';
import { RelationPaths } from '../../decorators/relations.decorator';
export declare class FacetEntityResolver {
    private facetValueService;
    private localeStringHydrator;
    private requestContextCache;
    constructor(facetValueService: FacetValueService, localeStringHydrator: LocaleStringHydrator, requestContextCache: RequestContextCacheService);
    name(ctx: RequestContext, facetValue: FacetValue): Promise<string>;
    languageCode(ctx: RequestContext, facetValue: FacetValue): Promise<string>;
    values(ctx: RequestContext, facet: Facet): Promise<FacetValue[]>;
    valueList(ctx: RequestContext, facet: Facet, args: {
        options: FacetValueListOptions;
    }, relations: RelationPaths<FacetValue>): Promise<PaginatedList<FacetValue>>;
}
