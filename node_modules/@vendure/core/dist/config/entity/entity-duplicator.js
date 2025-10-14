"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityDuplicator = void 0;
const configurable_operation_1 = require("../../common/configurable-operation");
/**
 * @description
 * An EntityDuplicator is used to define the logic for duplicating entities when the `duplicateEntity` mutation is called.
 * This allows you to add support for duplication of both core and custom entities.
 *
 * @example
 * ```ts title=src/config/custom-collection-duplicator.ts
 * import { Collection, LanguageCode, Permission
 *   EntityDuplicator, TransactionalConnection, CollectionService } from '\@vendure/core';
 *
 * let collectionService: CollectionService;
 * let connection: TransactionalConnection;
 *
 * // This is just an example - we already ship with a built-in duplicator for Collections.
 * const customCollectionDuplicator = new EntityDuplicator({
 *     code: 'custom-collection-duplicator',
 *     description: [{ languageCode: LanguageCode.en, value: 'Custom collection duplicator' }],
 *     args: {
 *         throwError: {
 *             type: 'boolean',
 *             defaultValue: false,
 *         },
 *     },
 *     forEntities: ['Collection'],
 *     requiresPermission: [Permission.UpdateCollection],
 *     init(injector) {
 *         collectionService = injector.get(CollectionService);
 *         connection = injector.get(TransactionalConnection);
 *     },
 *     duplicate: async input => {
 *         const { ctx, id, args } = input;
 *
 *         const original = await connection.getEntityOrThrow(ctx, Collection, id, {
 *             relations: {
 *                 assets: true,
 *                 featuredAsset: true,
 *             },
 *         });
 *         const newCollection = await collectionService.create(ctx, {
 *             isPrivate: original.isPrivate,
 *             customFields: original.customFields,
 *             assetIds: original.assets.map(a => a.id),
 *             featuredAssetId: original.featuredAsset?.id,
 *             parentId: original.parentId,
 *             filters: original.filters.map(f => ({
 *                 code: f.code,
 *                 arguments: f.args,
 *             })),
 *             inheritFilters: original.inheritFilters,
 *             translations: original.translations.map(t => ({
 *                 languageCode: t.languageCode,
 *                 name: `${t.name} (copy)`,
 *                 slug: `${t.slug}-copy`,
 *                 description: t.description,
 *                 customFields: t.customFields,
 *             })),
 *         });
 *
 *         if (args.throwError) {
 *             // If an error is thrown at any point during the duplication process, the entire
 *             // transaction will get automatically rolled back, and the mutation will return
 *             // an ErrorResponse containing the error message.
 *             throw new Error('Dummy error');
 *         }
 *
 *         return newCollection;
 *     },
 * });
 * ```
 *
 * The duplicator then gets passed to your VendureConfig object:
 *
 * ```ts title=src/vendure-config.ts
 * import { VendureConfig, defaultEntityDuplicators } from '\@vendure/core';
 * import { customCollectionDuplicator } from './config/custom-collection-duplicator';
 *
 * export const config: VendureConfig = {
 *    // ...
 *    entityOptions: {
 *      entityDuplicators: [
 *          ...defaultEntityDuplicators,
 *          customCollectionDuplicator,
 *      ],
 *    },
 * };
 * ```
 *
 * @docsPage EntityDuplicator
 * @docsWeight 0
 * @docsCategory configuration
 * @since 2.2.0
 */
class EntityDuplicator extends configurable_operation_1.ConfigurableOperationDef {
    /** @internal */
    canDuplicate(entityName) {
        return this._forEntities.includes(entityName);
    }
    /** @internal */
    get forEntities() {
        return this._forEntities;
    }
    /** @internal */
    get requiresPermission() {
        return (Array.isArray(this._requiresPermission)
            ? this._requiresPermission
            : [this._requiresPermission]);
    }
    constructor(config) {
        super(config);
        this._forEntities = config.forEntities;
        this._requiresPermission = config.requiresPermission;
        this.duplicateFn = config.duplicate;
    }
    duplicate(input) {
        return this.duplicateFn(Object.assign(Object.assign({}, input), { args: this.argsArrayToHash(input.args) }));
    }
}
exports.EntityDuplicator = EntityDuplicator;
//# sourceMappingURL=entity-duplicator.js.map