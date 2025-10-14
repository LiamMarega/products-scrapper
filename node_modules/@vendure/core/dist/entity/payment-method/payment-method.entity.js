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
exports.PaymentMethod = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const channel_entity_1 = require("../channel/channel.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const payment_method_translation_entity_1 = require("./payment-method-translation.entity");
/**
 * @description
 * A PaymentMethod is created automatically according to the configured {@link PaymentMethodHandler}s defined
 * in the {@link PaymentOptions} config.
 *
 * @docsCategory entities
 */
let PaymentMethod = class PaymentMethod extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.PaymentMethod = PaymentMethod;
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => payment_method_translation_entity_1.PaymentMethodTranslation, translation => translation.base, { eager: true }),
    __metadata("design:type", Array)
], PaymentMethod.prototype, "translations", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], PaymentMethod.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], PaymentMethod.prototype, "checker", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Object)
], PaymentMethod.prototype, "handler", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => channel_entity_1.Channel, channel => channel.paymentMethods),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], PaymentMethod.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomPaymentMethodFields),
    __metadata("design:type", custom_entity_fields_1.CustomPaymentMethodFields)
], PaymentMethod.prototype, "customFields", void 0);
exports.PaymentMethod = PaymentMethod = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], PaymentMethod);
//# sourceMappingURL=payment-method.entity.js.map