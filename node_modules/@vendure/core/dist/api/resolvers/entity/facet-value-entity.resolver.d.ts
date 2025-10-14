import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { Facet } from '../../../entity/facet/facet.entity';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { LocaleStringHydrator } from '../../../service/helpers/locale-string-hydrator/locale-string-hydrator';
import { FacetService } from '../../../service/services/facet.service';
import { RequestContext } from '../../common/request-context';
export declare class FacetValueEntityResolver {
    private facetService;
    private localeStringHydrator;
    private requestContextCache;
    constructor(facetService: FacetService, localeStringHydrator: LocaleStringHydrator, requestContextCache: RequestContextCacheService);
    name(ctx: RequestContext, facetValue: FacetValue): Promise<string>;
    languageCode(ctx: RequestContext, facetValue: FacetValue): Promise<string>;
    facet(ctx: RequestContext, facetValue: FacetValue): Promise<Facet | undefined>;
}
