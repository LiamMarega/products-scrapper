import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { Translated } from '../../../common/types/locale-types';
import { ProductOptionGroup } from '../../../entity/product-option-group/product-option-group.entity';
import { ProductOption } from '../../../entity/product-option/product-option.entity';
import { LocaleStringHydrator } from '../../../service/helpers/locale-string-hydrator/locale-string-hydrator';
import { ProductOptionGroupService } from '../../../service/services/product-option-group.service';
import { RequestContext } from '../../common/request-context';
export declare class ProductOptionEntityResolver {
    private productOptionGroupService;
    private localeStringHydrator;
    private requestContextCache;
    constructor(productOptionGroupService: ProductOptionGroupService, localeStringHydrator: LocaleStringHydrator, requestContextCache: RequestContextCacheService);
    name(ctx: RequestContext, productOption: ProductOption): Promise<string>;
    languageCode(ctx: RequestContext, productOption: ProductOption): Promise<string>;
    group(ctx: RequestContext, option: Translated<ProductOption>): Promise<ProductOptionGroup>;
}
