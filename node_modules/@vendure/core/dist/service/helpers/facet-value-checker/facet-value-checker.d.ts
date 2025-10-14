import { OnModuleInit } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../../api/index';
import { CacheService } from '../../../cache/cache.service';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { OrderLine } from '../../../entity/order-line/order-line.entity';
import { EventBus } from '../../../event-bus/index';
/**
 * @description
 * The FacetValueChecker is a helper class used to determine whether a given OrderLine consists
 * of ProductVariants containing the given FacetValues.
 *
 * @example
 * ```ts
 * import { FacetValueChecker, LanguageCode, PromotionCondition, TransactionalConnection } from '\@vendure/core';
 *
 * let facetValueChecker: FacetValueChecker;
 *
 * export const hasFacetValues = new PromotionCondition({
 *   code: 'at_least_n_with_facets',
 *   description: [
 *     { languageCode: LanguageCode.en, value: 'Buy at least { minimum } products with the given facets' },
 *   ],
 *   args: {
 *     minimum: { type: 'int' },
 *     facets: { type: 'ID', list: true, ui: { component: 'facet-value-form-input' } },
 *   },
 *   init(injector) {
 *     facetValueChecker = injector.get(FacetValueChecker);
 *   },
 *   async check(ctx, order, args) {
 *     let matches = 0;
 *     for (const line of order.lines) {
 *       if (await facetValueChecker.hasFacetValues(line, args.facets)) {
 *           matches += line.quantity;
 *       }
 *     }
 *     return args.minimum <= matches;
 *   },
 * });
 * ```
 *
 * @docsCategory Promotions
 */
export declare class FacetValueChecker implements OnModuleInit {
    private connection;
    private cacheService;
    private eventBus?;
    /**
     * @deprecated
     * Do not directly instantiate. Use the injector to get an instance:
     *
     * ```ts
     * facetValueChecker = injector.get(FacetValueChecker);
     * ```
     * @param connection
     */
    constructor(connection: TransactionalConnection, cacheService: CacheService, eventBus?: EventBus | undefined);
    private facetValueCache;
    onModuleInit(): any;
    /**
     * @description
     * Checks a given {@link OrderLine} against the facetValueIds and returns
     * `true` if the associated {@link ProductVariant} & {@link Product} together
     * have *all* the specified {@link FacetValue}s.
     */
    hasFacetValues(orderLine: OrderLine, facetValueIds: ID[], ctx?: RequestContext): Promise<boolean>;
}
