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
exports.ProductVariant = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const calculated_decorator_1 = require("../../common/calculated-decorator");
const round_money_1 = require("../../common/round-money");
const asset_entity_1 = require("../asset/asset.entity");
const base_entity_1 = require("../base/base.entity");
const channel_entity_1 = require("../channel/channel.entity");
const collection_entity_1 = require("../collection/collection.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const entity_id_decorator_1 = require("../entity-id.decorator");
const facet_value_entity_1 = require("../facet-value/facet-value.entity");
const order_line_entity_1 = require("../order-line/order-line.entity");
const product_entity_1 = require("../product/product.entity");
const product_option_entity_1 = require("../product-option/product-option.entity");
const stock_level_entity_1 = require("../stock-level/stock-level.entity");
const stock_movement_entity_1 = require("../stock-movement/stock-movement.entity");
const tax_category_entity_1 = require("../tax-category/tax-category.entity");
const product_variant_asset_entity_1 = require("./product-variant-asset.entity");
const product_variant_price_entity_1 = require("./product-variant-price.entity");
const product_variant_translation_entity_1 = require("./product-variant-translation.entity");
/**
 * @description
 * A ProductVariant represents a single stock keeping unit (SKU) in the store's inventory.
 * Whereas a {@link Product} is a "container" of variants, the variant itself holds the
 * data on price, tax category etc. When one adds items to their cart, they are adding
 * ProductVariants, not Products.
 *
 * @docsCategory entities
 */
let ProductVariant = class ProductVariant extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
    get price() {
        if (this.listPrice == null) {
            return 0;
        }
        return (0, round_money_1.roundMoney)(this.listPriceIncludesTax ? this.taxRateApplied.netPriceOf(this.listPrice) : this.listPrice);
    }
    get priceWithTax() {
        if (this.listPrice == null) {
            return 0;
        }
        return (0, round_money_1.roundMoney)(this.listPriceIncludesTax ? this.listPrice : this.taxRateApplied.grossPriceOf(this.listPrice));
    }
};
exports.ProductVariant = ProductVariant;
__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductVariant.prototype, "sku", void 0);
__decorate([
    (0, calculated_decorator_1.Calculated)({
        expression: 'productvariant__productVariantPrices.price',
    }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ProductVariant.prototype, "price", null);
__decorate([
    (0, calculated_decorator_1.Calculated)({
        // Note: this works fine for sorting by priceWithTax, but filtering will return inaccurate
        // results due to this expression not taking taxes into account. This is because the tax
        // rate is calculated at run-time in the application layer based on the current context,
        // and is unknown to the database.
        expression: 'productvariant__productVariantPrices.price',
    }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ProductVariant.prototype, "priceWithTax", null);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => asset_entity_1.Asset, asset => asset.featuredInVariants, { onDelete: 'SET NULL' }),
    __metadata("design:type", asset_entity_1.Asset)
], ProductVariant.prototype, "featuredAsset", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "featuredAssetId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => product_variant_asset_entity_1.ProductVariantAsset, productVariantAsset => productVariantAsset.productVariant, {
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", Array)
], ProductVariant.prototype, "assets", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => tax_category_entity_1.TaxCategory, taxCategory => taxCategory.productVariants),
    __metadata("design:type", tax_category_entity_1.TaxCategory)
], ProductVariant.prototype, "taxCategory", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "taxCategoryId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => product_variant_price_entity_1.ProductVariantPrice, price => price.variant, { eager: true }),
    __metadata("design:type", Array)
], ProductVariant.prototype, "productVariantPrices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => product_variant_translation_entity_1.ProductVariantTranslation, translation => translation.base, { eager: true }),
    __metadata("design:type", Array)
], ProductVariant.prototype, "translations", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => product_entity_1.Product, product => product.variants),
    __metadata("design:type", product_entity_1.Product)
], ProductVariant.prototype, "product", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "outOfStockThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "useGlobalOutOfStockThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: generated_types_1.GlobalFlag.INHERIT }),
    __metadata("design:type", String)
], ProductVariant.prototype, "trackInventory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => stock_level_entity_1.StockLevel, stockLevel => stockLevel.productVariant),
    __metadata("design:type", Array)
], ProductVariant.prototype, "stockLevels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => stock_movement_entity_1.StockMovement, stockMovement => stockMovement.productVariant),
    __metadata("design:type", Array)
], ProductVariant.prototype, "stockMovements", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => product_option_entity_1.ProductOption, productOption => productOption.productVariants),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ProductVariant.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => facet_value_entity_1.FacetValue, facetValue => facetValue.productVariants),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ProductVariant.prototype, "facetValues", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomProductVariantFields),
    __metadata("design:type", custom_entity_fields_1.CustomProductVariantFields)
], ProductVariant.prototype, "customFields", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => collection_entity_1.Collection, collection => collection.productVariants),
    __metadata("design:type", Array)
], ProductVariant.prototype, "collections", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => channel_entity_1.Channel, channel => channel.productVariants),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ProductVariant.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => order_line_entity_1.OrderLine, orderLine => orderLine.productVariant),
    __metadata("design:type", Array)
], ProductVariant.prototype, "lines", void 0);
exports.ProductVariant = ProductVariant = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], ProductVariant);
//# sourceMappingURL=product-variant.entity.js.map