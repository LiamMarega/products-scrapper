"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionDuplicator = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const collection_entity_1 = require("../../../entity/collection/collection.entity");
const collection_service_1 = require("../../../service/services/collection.service");
const entity_duplicator_1 = require("../entity-duplicator");
let connection;
let collectionService;
/**
 * @description
 * Duplicates a Collection
 */
exports.collectionDuplicator = new entity_duplicator_1.EntityDuplicator({
    code: 'collection-duplicator',
    description: [
        {
            languageCode: generated_types_1.LanguageCode.en,
            value: 'Default duplicator for Collections',
        },
    ],
    requiresPermission: [generated_types_1.Permission.CreateCollection, generated_types_1.Permission.CreateCatalog],
    forEntities: ['Collection'],
    args: {},
    init(injector) {
        connection = injector.get(transactional_connection_1.TransactionalConnection);
        collectionService = injector.get(collection_service_1.CollectionService);
    },
    async duplicate({ ctx, id }) {
        var _a;
        const collection = await connection.getEntityOrThrow(ctx, collection_entity_1.Collection, id, {
            relations: {
                featuredAsset: true,
                assets: true,
                channels: true,
            },
        });
        const translations = collection.translations.map(translation => {
            return {
                name: translation.name + ' (copy)',
                slug: translation.slug + '-copy',
                description: translation.description,
                languageCode: translation.languageCode,
                customFields: translation.customFields,
            };
        });
        const collectionInput = {
            featuredAssetId: (_a = collection.featuredAsset) === null || _a === void 0 ? void 0 : _a.id,
            isPrivate: true,
            assetIds: collection.assets.map(value => value.assetId),
            parentId: collection.parentId,
            translations,
            customFields: collection.customFields,
            filters: collection.filters.map(filter => ({
                code: filter.code,
                arguments: filter.args,
            })),
        };
        const duplicatedCollection = await collectionService.create(ctx, collectionInput);
        return duplicatedCollection;
    },
});
//# sourceMappingURL=collection-duplicator.js.map