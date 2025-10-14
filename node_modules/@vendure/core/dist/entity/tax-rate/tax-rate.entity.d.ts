import { TaxLine } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomTaxRateFields } from '../custom-entity-fields';
import { CustomerGroup } from '../customer-group/customer-group.entity';
import { TaxCategory } from '../tax-category/tax-category.entity';
import { Zone } from '../zone/zone.entity';
/**
 * @description
 * A TaxRate defines the rate of tax to apply to a {@link ProductVariant} based on three factors:
 *
 * 1. the ProductVariant's {@link TaxCategory}
 * 2. the applicable {@link Zone} ("applicable" being defined by the configured {@link TaxZoneStrategy})
 * 3. the {@link CustomerGroup} of the current Customer
 *
 * @docsCategory entities
 */
export declare class TaxRate extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<TaxRate>);
    name: string;
    enabled: boolean;
    value: number;
    category: TaxCategory;
    categoryId: ID;
    zone: Zone;
    zoneId: ID;
    customerGroup?: CustomerGroup;
    customFields: CustomTaxRateFields;
    /**
     * Returns the tax component of a given gross price.
     */
    taxComponentOf(grossPrice: number): number;
    /**
     * Given a gross (tax-inclusive) price, returns the net price.
     */
    netPriceOf(grossPrice: number): number;
    /**
     * Returns the tax applicable to the given net price.
     */
    taxPayableOn(netPrice: number): number;
    /**
     * Given a net price, return the gross price (net + tax)
     */
    grossPriceOf(netPrice: number): number;
    apply(price: number): TaxLine;
    test(zone: Zone | ID, taxCategory: TaxCategory | ID): boolean;
    private isId;
}
