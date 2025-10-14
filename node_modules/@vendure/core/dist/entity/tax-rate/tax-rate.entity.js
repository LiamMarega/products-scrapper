"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxRate = void 0;
const typeorm_1 = require("typeorm");
const tax_utils_1 = require("../../common/tax-utils");
const utils_1 = require("../../common/utils");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const customer_group_entity_1 = require("../customer-group/customer-group.entity");
const entity_id_decorator_1 = require("../entity-id.decorator");
const tax_category_entity_1 = require("../tax-category/tax-category.entity");
const value_transformers_1 = require("../value-transformers");
const zone_entity_1 = require("../zone/zone.entity");
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
let TaxRate = class TaxRate extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
    /**
     * Returns the tax component of a given gross price.
     */
    taxComponentOf(grossPrice) {
        return (0, tax_utils_1.taxComponentOf)(grossPrice, this.value);
    }
    /**
     * Given a gross (tax-inclusive) price, returns the net price.
     */
    netPriceOf(grossPrice) {
        return (0, tax_utils_1.netPriceOf)(grossPrice, this.value);
    }
    /**
     * Returns the tax applicable to the given net price.
     */
    taxPayableOn(netPrice) {
        return (0, tax_utils_1.taxPayableOn)(netPrice, this.value);
    }
    /**
     * Given a net price, return the gross price (net + tax)
     */
    grossPriceOf(netPrice) {
        return (0, tax_utils_1.grossPriceOf)(netPrice, this.value);
    }
    apply(price) {
        return {
            description: this.name,
            taxRate: this.value,
        };
    }
    test(zone, taxCategory) {
        const taxCategoryId = this.isId(taxCategory) ? taxCategory : taxCategory.id;
        const zoneId = this.isId(zone) ? zone : zone.id;
        return (0, utils_1.idsAreEqual)(taxCategoryId, this.categoryId) && (0, utils_1.idsAreEqual)(zoneId, this.zoneId);
    }
    isId(entityOrId) {
        return typeof entityOrId === 'string' || typeof entityOrId === 'number';
    }
};
exports.TaxRate = TaxRate;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaxRate.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], TaxRate.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, transformer: new value_transformers_1.DecimalTransformer() }),
    __metadata("design:type", Number)
], TaxRate.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => tax_category_entity_1.TaxCategory, taxCategory => taxCategory.taxRates),
    __metadata("design:type", tax_category_entity_1.TaxCategory)
], TaxRate.prototype, "category", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], TaxRate.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => zone_entity_1.Zone, zone => zone.taxRates),
    __metadata("design:type", zone_entity_1.Zone)
], TaxRate.prototype, "zone", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], TaxRate.prototype, "zoneId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => customer_group_entity_1.CustomerGroup, customerGroup => customerGroup.taxRates, { nullable: true }),
    __metadata("design:type", customer_group_entity_1.CustomerGroup)
], TaxRate.prototype, "customerGroup", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomTaxRateFields),
    __metadata("design:type", custom_entity_fields_1.CustomTaxRateFields)
], TaxRate.prototype, "customFields", void 0);
exports.TaxRate = TaxRate = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], TaxRate);
//# sourceMappingURL=tax-rate.entity.js.map