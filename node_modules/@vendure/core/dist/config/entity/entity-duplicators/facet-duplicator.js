"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facetDuplicator = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const facet_entity_1 = require("../../../entity/facet/facet.entity");
const facet_value_service_1 = require("../../../service/services/facet-value.service");
const facet_service_1 = require("../../../service/services/facet.service");
const entity_duplicator_1 = require("../entity-duplicator");
let connection;
let facetService;
let facetValueService;
/**
 * @description
 * Duplicates a Facet
 */
exports.facetDuplicator = new entity_duplicator_1.EntityDuplicator({
    code: 'facet-duplicator',
    description: [
        {
            languageCode: generated_types_1.LanguageCode.en,
            value: 'Default duplicator for Facets',
        },
    ],
    requiresPermission: [generated_types_1.Permission.CreateFacet, generated_types_1.Permission.CreateCatalog],
    forEntities: ['Facet'],
    args: {
        includeFacetValues: {
            type: 'boolean',
            defaultValue: true,
            label: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Include facet values' }],
        },
    },
    init(injector) {
        connection = injector.get(transactional_connection_1.TransactionalConnection);
        facetService = injector.get(facet_service_1.FacetService);
        facetValueService = injector.get(facet_value_service_1.FacetValueService);
    },
    async duplicate({ ctx, id, args }) {
        const facet = await connection.getEntityOrThrow(ctx, facet_entity_1.Facet, id, {
            relations: {
                values: true,
            },
        });
        const translations = facet.translations.map(translation => {
            return {
                name: translation.name + ' (copy)',
                languageCode: translation.languageCode,
                customFields: translation.customFields,
            };
        });
        const facetInput = {
            isPrivate: true,
            translations,
            customFields: facet.customFields,
            code: facet.code + '-copy',
        };
        const duplicatedFacet = await facetService.create(ctx, facetInput);
        if (args.includeFacetValues) {
            if (facet.values.length) {
                for (const value of facet.values) {
                    const newValue = await facetValueService.create(ctx, duplicatedFacet, {
                        code: value.code + '-copy',
                        translations: value.translations.map(translation => ({
                            name: translation.name + ' (copy)',
                            languageCode: translation.languageCode,
                            customFields: translation.customFields,
                        })),
                        facetId: duplicatedFacet.id,
                        customFields: value.customFields,
                    });
                    duplicatedFacet.values.push(newValue);
                }
            }
        }
        return duplicatedFacet;
    },
});
//# sourceMappingURL=facet-duplicator.js.map