"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteSearchStrategy = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const errors_1 = require("../../../common/error/errors");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const constants_1 = require("../constants");
const search_index_item_entity_1 = require("../entities/search-index-item.entity");
const search_strategy_utils_1 = require("./search-strategy-utils");
/**
 *
 * @description
 * A rather naive search for SQLite / SQL.js. Rather than proper
 * full-text searching, it uses a weighted `LIKE "%term%"` operator instead.
 *
 * @docsCategory DefaultSearchPlugin
 */
class SqliteSearchStrategy {
    constructor() {
        this.minTermLength = 2;
    }
    async init(injector) {
        this.connection = injector.get(transactional_connection_1.TransactionalConnection);
        this.options = injector.get(constants_1.PLUGIN_INIT_OPTIONS);
    }
    async getFacetValueIds(ctx, input, enabledOnly) {
        const facetValuesQb = this.connection
            .getRepository(ctx, search_index_item_entity_1.SearchIndexItem)
            .createQueryBuilder('si')
            .select(['si.productId', 'si.productVariantId'])
            .addSelect('GROUP_CONCAT(si.facetValueIds)', 'facetValues');
        this.applyTermAndFilters(ctx, facetValuesQb, input);
        if (!input.groupByProduct) {
            facetValuesQb.groupBy('si.productVariantId');
        }
        if (enabledOnly) {
            facetValuesQb.andWhere('si.enabled = :enabled', { enabled: true });
        }
        const facetValuesResult = await facetValuesQb.getRawMany();
        return (0, search_strategy_utils_1.createFacetIdCountMap)(facetValuesResult);
    }
    async getCollectionIds(ctx, input, enabledOnly) {
        const collectionsQb = this.connection
            .getRepository(ctx, search_index_item_entity_1.SearchIndexItem)
            .createQueryBuilder('si')
            .select(['si.productId', 'si.productVariantId'])
            .addSelect('GROUP_CONCAT(si.collectionIds)', 'collections');
        this.applyTermAndFilters(ctx, collectionsQb, input);
        if (!input.groupByProduct) {
            collectionsQb.groupBy('si.productVariantId');
        }
        if (enabledOnly) {
            collectionsQb.andWhere('si.enabled = :enabled', { enabled: true });
        }
        const collectionsResult = await collectionsQb.getRawMany();
        return (0, search_strategy_utils_1.createCollectionIdCountMap)(collectionsResult);
    }
    async getSearchResults(ctx, input, enabledOnly) {
        const take = input.take || 25;
        const skip = input.skip || 0;
        const sort = input.sort;
        const qb = this.connection.getRepository(ctx, search_index_item_entity_1.SearchIndexItem).createQueryBuilder('si');
        if (input.groupByProduct) {
            qb.addSelect('MIN(si.price)', 'minPrice');
            qb.addSelect('MAX(si.price)', 'maxPrice');
            qb.addSelect('MIN(si.priceWithTax)', 'minPriceWithTax');
            qb.addSelect('MAX(si.priceWithTax)', 'maxPriceWithTax');
        }
        this.applyTermAndFilters(ctx, qb, input);
        if (sort) {
            if (sort.name) {
                // TODO: v3 - set the collation on the SearchIndexItem entity
                qb.addOrderBy('si.productName COLLATE NOCASE', sort.name);
            }
            if (sort.price) {
                qb.addOrderBy('si.price', sort.price);
            }
        }
        else if (input.term && input.term.length > this.minTermLength) {
            qb.addOrderBy('score', 'DESC');
        }
        // Required to ensure deterministic sorting.
        // E.g. in case of sorting products with duplicate name, price or score results.
        qb.addOrderBy('si.productVariantId', 'ASC');
        if (enabledOnly) {
            qb.andWhere('si.enabled = :enabled', { enabled: true });
        }
        return await qb
            .limit(take)
            .offset(skip)
            .getRawMany()
            .then(res => res.map(r => (0, search_strategy_utils_1.mapToSearchResult)(r, ctx.channel.defaultCurrencyCode)));
    }
    async getTotalCount(ctx, input, enabledOnly) {
        const innerQb = this.applyTermAndFilters(ctx, this.connection.getRepository(ctx, search_index_item_entity_1.SearchIndexItem).createQueryBuilder('si'), input);
        if (enabledOnly) {
            innerQb.andWhere('si.enabled = :enabled', { enabled: true });
        }
        const totalItemsQb = this.connection.rawConnection
            .createQueryBuilder()
            .select('COUNT(*) as total')
            .from(`(${innerQb.getQuery()})`, 'inner')
            .setParameters(innerQb.getParameters());
        return totalItemsQb.getRawOne().then(res => res.total);
    }
    applyTermAndFilters(ctx, qb, input) {
        const { term, facetValueFilters, facetValueIds, facetValueOperator, collectionId, collectionSlug } = input;
        qb.where('1 = 1');
        if (term && term.length > this.minTermLength) {
            // Note: SQLite does not natively have fulltext search capabilities,
            // so we just use a weighted LIKE match
            qb.addSelect(`
                    CASE WHEN si.sku LIKE :like_term THEN 10 ELSE 0 END +
                    CASE WHEN si.productName LIKE :like_term THEN 3 ELSE 0 END +
                    CASE WHEN si.productVariantName LIKE :like_term THEN 2 ELSE 0 END +
                    CASE WHEN si.description LIKE :like_term THEN 1 ELSE 0 END`, 'score')
                .andWhere(new typeorm_1.Brackets(qb1 => {
                qb1.where('si.sku LIKE :like_term')
                    .orWhere('si.productName LIKE :like_term')
                    .orWhere('si.productVariantName LIKE :like_term')
                    .orWhere('si.description LIKE :like_term');
            }))
                .setParameters({ term, like_term: `%${term}%` });
        }
        if (input.inStock != null) {
            if (input.groupByProduct) {
                qb.andWhere('si.productInStock = :inStock', { inStock: input.inStock });
            }
            else {
                qb.andWhere('si.inStock = :inStock', { inStock: input.inStock });
            }
        }
        if (facetValueIds === null || facetValueIds === void 0 ? void 0 : facetValueIds.length) {
            qb.andWhere(new typeorm_1.Brackets(qb1 => {
                for (const id of facetValueIds) {
                    const placeholder = (0, search_strategy_utils_1.createPlaceholderFromId)(id);
                    const clause = `(',' || si.facetValueIds || ',') LIKE :${placeholder}`;
                    const params = { [placeholder]: `%,${id},%` };
                    if (facetValueOperator === generated_types_1.LogicalOperator.AND) {
                        qb1.andWhere(clause, params);
                    }
                    else {
                        qb1.orWhere(clause, params);
                    }
                }
            }));
        }
        if (facetValueFilters === null || facetValueFilters === void 0 ? void 0 : facetValueFilters.length) {
            qb.andWhere(new typeorm_1.Brackets(qb1 => {
                for (const facetValueFilter of facetValueFilters) {
                    qb1.andWhere(new typeorm_1.Brackets(qb2 => {
                        var _a, _b;
                        if (facetValueFilter.and && ((_a = facetValueFilter.or) === null || _a === void 0 ? void 0 : _a.length)) {
                            throw new errors_1.UserInputError('error.facetfilterinput-invalid-input');
                        }
                        if (facetValueFilter.and) {
                            const placeholder = (0, search_strategy_utils_1.createPlaceholderFromId)(facetValueFilter.and);
                            const clause = `(',' || si.facetValueIds || ',') LIKE :${placeholder}`;
                            const params = { [placeholder]: `%,${facetValueFilter.and},%` };
                            qb2.where(clause, params);
                        }
                        if ((_b = facetValueFilter.or) === null || _b === void 0 ? void 0 : _b.length) {
                            for (const id of facetValueFilter.or) {
                                const placeholder = (0, search_strategy_utils_1.createPlaceholderFromId)(id);
                                const clause = `(',' || si.facetValueIds || ',') LIKE :${placeholder}`;
                                const params = { [placeholder]: `%,${id},%` };
                                qb2.orWhere(clause, params);
                            }
                        }
                    }));
                }
            }));
        }
        if (collectionId) {
            qb.andWhere("(',' || si.collectionIds || ',') LIKE :collectionId", {
                collectionId: `%,${collectionId},%`,
            });
        }
        if (collectionSlug) {
            qb.andWhere("(',' || si.collectionSlugs || ',') LIKE :collectionSlug", {
                collectionSlug: `%,${collectionSlug},%`,
            });
        }
        qb.andWhere('si.channelId = :channelId', { channelId: ctx.channelId });
        (0, search_strategy_utils_1.applyLanguageConstraints)(qb, ctx.languageCode, ctx.channel.defaultLanguageCode);
        if (input.groupByProduct === true) {
            qb.groupBy('si.productId');
        }
        return qb;
    }
}
exports.SqliteSearchStrategy = SqliteSearchStrategy;
//# sourceMappingURL=sqlite-search-strategy.js.map