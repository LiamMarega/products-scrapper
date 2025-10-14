import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity } from '..';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { CustomGlobalSettingsFields } from '../custom-entity-fields';
/**
 * @description Stores global settings for the whole application
 *
 * @docsCategory entities
 */
export declare class GlobalSettings extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<GlobalSettings>);
    /**
     * @deprecated use `Channel.availableLanguageCodes`
     */
    availableLanguages: LanguageCode[];
    /**
     * @description
     * Specifies the default value for inventory tracking for ProductVariants.
     * Can be overridden per ProductVariant, but this value determines the default
     * if not otherwise specified.
     *
     * @deprecated use `Channel.trackInventory`
     */
    trackInventory: boolean;
    /**
     * @description
     * Specifies the value of stockOnHand at which a given ProductVariant is considered
     * out of stock.
     *
     * @deprecated use `Channel.outOfStockThreshold`
     */
    outOfStockThreshold: number;
    customFields: CustomGlobalSettingsFields;
}
