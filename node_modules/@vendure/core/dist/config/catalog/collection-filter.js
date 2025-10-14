"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionFilter = void 0;
const configurable_operation_1 = require("../../common/configurable-operation");
/* eslint-disable max-len */
/**
 * @description
 * A CollectionFilter defines a rule which can be used to associate ProductVariants with a Collection.
 * The filtering is done by defining the `apply()` function, which receives a TypeORM
 * [`QueryBuilder`](https://typeorm.io/#/select-query-builder) object to which clauses may be added.
 *
 * Creating a CollectionFilter is considered an advanced Vendure topic. For more insight into how
 * they work, study the [default collection filters](https://github.com/vendure-ecommerce/vendure/blob/master/packages/core/src/config/catalog/default-collection-filters.ts)
 *
 * Here's a simple example of a custom CollectionFilter:
 *
 * @example
 * ```ts
 * import { CollectionFilter, LanguageCode } from '\@vendure/core';
 *
 * export const skuCollectionFilter = new CollectionFilter({
 *   args: {
 *     // The `args` object defines the user-configurable arguments
 *     // which will get passed to the filter's `apply()` function.
 *     sku: {
 *       type: 'string',
 *       label: [{ languageCode: LanguageCode.en, value: 'SKU' }],
 *       description: [
 *         {
 *           languageCode: LanguageCode.en,
 *           value: 'Matches any product variants with SKUs containing this value',
 *         },
 *       ],
 *     },
 *   },
 *   code: 'variant-sku-filter',
 *   description: [{ languageCode: LanguageCode.en, value: 'Filter by matching SKU' }],
 *
 *   // This is the function that defines the logic of the filter.
 *   apply: (qb, args) => {
 *     const LIKE = qb.connection.options.type === 'postgres' ? 'ILIKE' : 'LIKE';
 *     return qb.andWhere(`productVariant.sku ${LIKE} :sku`, { sku: `%${args.sku}%` });
 *   },
 * });
 * ```
 *
 * @docsCategory configuration
 */
class CollectionFilter extends configurable_operation_1.ConfigurableOperationDef {
    constructor(config) {
        super(config);
        this.applyFn = config.apply;
    }
    apply(qb, args) {
        return this.applyFn(qb, this.argsArrayToHash(args));
    }
}
exports.CollectionFilter = CollectionFilter;
//# sourceMappingURL=collection-filter.js.map