import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
export declare class SearchIndexItem {
    constructor(input?: Partial<SearchIndexItem>);
    productVariantId: ID;
    languageCode: LanguageCode;
    channelId: ID;
    productId: ID;
    enabled: boolean;
    productName: string;
    productVariantName: string;
    description: string;
    slug: string;
    sku: string;
    price: number;
    priceWithTax: number;
    facetIds: string[];
    facetValueIds: string[];
    collectionIds: string[];
    collectionSlugs: string[];
    channelIds: string[];
    productPreview: string;
    productPreviewFocalPoint?: {
        x: number;
        y: number;
    } | null;
    productVariantPreview: string;
    productVariantPreviewFocalPoint?: {
        x: number;
        y: number;
    } | null;
    productAssetId: ID | null;
    productVariantAssetId: ID | null;
    inStock?: boolean;
    productInStock?: boolean;
}
