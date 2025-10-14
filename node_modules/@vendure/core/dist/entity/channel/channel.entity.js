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
exports.Channel = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const __1 = require("..");
const base_entity_1 = require("../base/base.entity");
const collection_entity_1 = require("../collection/collection.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const entity_id_decorator_1 = require("../entity-id.decorator");
const facet_entity_1 = require("../facet/facet.entity");
const facet_value_entity_1 = require("../facet-value/facet-value.entity");
const product_entity_1 = require("../product/product.entity");
const product_variant_entity_1 = require("../product-variant/product-variant.entity");
const seller_entity_1 = require("../seller/seller.entity");
const zone_entity_1 = require("../zone/zone.entity");
/**
 * @description
 * A Channel represents a distinct sales channel and configures defaults for that
 * channel.
 *
 * * Set a channel-specific currency, language, tax and shipping defaults
 * * Assign only specific Products to the Channel (with Channel-specific prices)
 * * Create Administrator roles limited to the Channel
 * * Assign only specific StockLocations, Assets, Facets, Collections, Promotions, ShippingMethods & PaymentMethods to the Channel
 * * Have Orders and Customers associated with specific Channels.
 *
 * In Vendure, Channels have a number of different uses, such as:
 *
 * * Multi-region stores, where there is a distinct website for each territory with its own available inventory, pricing, tax and shipping rules.
 * * Creating distinct rules and inventory for different sales channels such as Amazon.
 * * Specialized stores offering a subset of the main inventory.
 * * Implementing multi-vendor marketplace applications.
 *
 * @docsCategory entities
 */
let Channel = class Channel extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
        if (!input || !input.token) {
            this.token = this.generateToken();
        }
    }
    generateToken() {
        const randomString = () => Math.random().toString(36).substr(3, 10);
        return `${randomString()}${randomString()}`;
    }
};
exports.Channel = Channel;
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Channel.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Channel.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '', nullable: true }),
    __metadata("design:type", String)
], Channel.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => seller_entity_1.Seller, seller => seller.channels),
    __metadata("design:type", seller_entity_1.Seller)
], Channel.prototype, "seller", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], Channel.prototype, "sellerId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Channel.prototype, "defaultLanguageCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Channel.prototype, "availableLanguageCodes", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => zone_entity_1.Zone, zone => zone.defaultTaxZoneChannels),
    __metadata("design:type", zone_entity_1.Zone)
], Channel.prototype, "defaultTaxZone", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => zone_entity_1.Zone, zone => zone.defaultShippingZoneChannels),
    __metadata("design:type", zone_entity_1.Zone)
], Channel.prototype, "defaultShippingZone", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Channel.prototype, "defaultCurrencyCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Channel.prototype, "availableCurrencyCodes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Channel.prototype, "trackInventory", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Channel.prototype, "outOfStockThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomChannelFields),
    __metadata("design:type", custom_entity_fields_1.CustomChannelFields)
], Channel.prototype, "customFields", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Channel.prototype, "pricesIncludeTax", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => product_entity_1.Product, product => product.channels, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Channel.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => product_variant_entity_1.ProductVariant, productVariant => productVariant.channels, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Channel.prototype, "productVariants", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => facet_value_entity_1.FacetValue, facetValue => facetValue.channels, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Channel.prototype, "facetValues", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => facet_entity_1.Facet, facet => facet.channels, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Channel.prototype, "facets", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => collection_entity_1.Collection, collection => collection.channels, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Channel.prototype, "collections", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => __1.Promotion, promotion => promotion.channels, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Channel.prototype, "promotions", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => __1.PaymentMethod, paymentMethod => paymentMethod.channels, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Channel.prototype, "paymentMethods", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => __1.ShippingMethod, shippingMethod => shippingMethod.channels, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Channel.prototype, "shippingMethods", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => __1.Customer, customer => customer.channels, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Channel.prototype, "customers", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => __1.Role, role => role.channels, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Channel.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => __1.StockLocation, stockLocation => stockLocation.channels, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Channel.prototype, "stockLocations", void 0);
exports.Channel = Channel = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Channel);
//# sourceMappingURL=channel.entity.js.map