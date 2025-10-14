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
exports.PaymentMethodTranslation = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const payment_method_entity_1 = require("./payment-method.entity");
let PaymentMethodTranslation = class PaymentMethodTranslation extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
        // This is a workaround for the fact that
        // MySQL does not support default values on TEXT columns
        if (this.description === undefined) {
            this.description = '';
        }
    }
};
exports.PaymentMethodTranslation = PaymentMethodTranslation;
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], PaymentMethodTranslation.prototype, "languageCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentMethodTranslation.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], PaymentMethodTranslation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => payment_method_entity_1.PaymentMethod, base => base.translations, { onDelete: 'CASCADE' }),
    __metadata("design:type", payment_method_entity_1.PaymentMethod)
], PaymentMethodTranslation.prototype, "base", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomPaymentMethodFieldsTranslation),
    __metadata("design:type", custom_entity_fields_1.CustomPaymentMethodFieldsTranslation)
], PaymentMethodTranslation.prototype, "customFields", void 0);
exports.PaymentMethodTranslation = PaymentMethodTranslation = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], PaymentMethodTranslation);
//# sourceMappingURL=payment-method-translation.entity.js.map