"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToSearchResult = mapToSearchResult;
exports.createFacetIdCountMap = createFacetIdCountMap;
exports.createCollectionIdCountMap = createCollectionIdCountMap;
exports.createPlaceholderFromId = createPlaceholderFromId;
exports.applyLanguageConstraints = applyLanguageConstraints;
const unique_1 = require("@vendure/common/lib/unique");
const typeorm_1 = require("typeorm");
const search_index_item_entity_1 = require("../entities/search-index-item.entity");
/**
 * Maps a raw database result to a SearchResult.
 */
function mapToSearchResult(raw, currencyCode) {
    const price = raw.minPrice !== undefined
        ? { min: raw.minPrice, max: raw.maxPrice }
        : { value: raw.si_price };
    const priceWithTax = raw.minPriceWithTax !== undefined
        ? { min: raw.minPriceWithTax, max: raw.maxPriceWithTax }
        : { value: raw.si_priceWithTax };
    const productAsset = !raw.si_productAssetId
        ? undefined
        : {
            id: raw.si_productAssetId,
            preview: raw.si_productPreview,
            focalPoint: parseFocalPoint(raw.si_productPreviewFocalPoint),
        };
    const productVariantAsset = !raw.si_productVariantAssetId
        ? undefined
        : {
            id: raw.si_productVariantAssetId,
            preview: raw.si_productVariantPreview,
            focalPoint: parseFocalPoint(raw.si_productVariantPreviewFocalPoint),
        };
    const enabled = raw.productEnabled != null ? !!Number(raw.productEnabled) : raw.si_enabled;
    return {
        sku: raw.si_sku,
        slug: raw.si_slug,
        price,
        enabled,
        priceWithTax,
        currencyCode,
        productVariantId: raw.si_productVariantId,
        productId: raw.si_productId,
        productName: raw.si_productName,
        productVariantName: raw.si_productVariantName,
        description: raw.si_description,
        facetIds: raw.si_facetIds.split(',').map((x) => x.trim()),
        facetValueIds: raw.si_facetValueIds.split(',').map((x) => x.trim()),
        collectionIds: raw.si_collectionIds.split(',').map((x) => x.trim()),
        channelIds: raw.si_channelIds.split(',').map((x) => x.trim()),
        productAsset,
        productVariantAsset,
        score: raw.score || 0,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        inStock: raw.si_inStock,
    };
}
/**
 * Given the raw query results containing rows with a `facetValues` property line "1,2,1,2",
 * this function returns a map of FacetValue ids => count of how many times they occur.
 */
function createFacetIdCountMap(facetValuesResult) {
    const result = new Map();
    for (const res of facetValuesResult) {
        const facetValueIds = (0, unique_1.unique)(res.facetValues.split(',').filter(x => x !== ''));
        for (const id of facetValueIds) {
            const count = result.get(id);
            const newCount = count ? count + 1 : 1;
            result.set(id, newCount);
        }
    }
    return result;
}
/**
 * Given the raw query results containing rows with a `collections` property line "1,2,1,2",
 * this function returns a map of Collection ids => count of how many times they occur.
 */
function createCollectionIdCountMap(collectionsResult) {
    const result = new Map();
    for (const res of collectionsResult) {
        const collectionIds = (0, unique_1.unique)(res.collections.split(',').filter(x => x !== ''));
        for (const id of collectionIds) {
            const count = result.get(id);
            const newCount = count ? count + 1 : 1;
            result.set(id, newCount);
        }
    }
    return result;
}
function parseFocalPoint(focalPoint) {
    if (focalPoint && typeof focalPoint === 'string') {
        try {
            return JSON.parse(focalPoint);
        }
        catch (e) {
            // fall though
        }
    }
    return;
}
function createPlaceholderFromId(id) {
    return '_' + id.toString().replace(/-/g, '_');
}
/**
 * Applies language constraints for {@link SearchIndexItem} query.
 *
 * @param qb QueryBuilder instance
 * @param languageCode Preferred language code
 * @param defaultLanguageCode Default language code that is used if {@link SearchIndexItem} is not available in preferred language
 */
function applyLanguageConstraints(qb, languageCode, defaultLanguageCode) {
    const lcEscaped = qb.escape('languageCode');
    const ciEscaped = qb.escape('channelId');
    const pviEscaped = qb.escape('productVariantId');
    if (languageCode === defaultLanguageCode) {
        qb.andWhere(`si.${lcEscaped} = :languageCode`, {
            languageCode,
        });
    }
    else {
        qb.andWhere(`si.${lcEscaped} IN (:...languageCodes)`, {
            languageCodes: [languageCode, defaultLanguageCode],
        });
        qb.leftJoin(search_index_item_entity_1.SearchIndexItem, 'sil', `sil.${lcEscaped} = :languageCode AND sil.${ciEscaped} = si.${ciEscaped} AND sil.${pviEscaped} = si.${pviEscaped}`, {
            languageCode,
        });
        qb.andWhere(new typeorm_1.Brackets(qb1 => {
            qb1.where(`si.${lcEscaped} = :languageCode1`, {
                languageCode1: languageCode,
            }).orWhere(`sil.${lcEscaped} IS NULL`);
        }));
    }
    return qb;
}
//# sourceMappingURL=search-strategy-utils.js.map