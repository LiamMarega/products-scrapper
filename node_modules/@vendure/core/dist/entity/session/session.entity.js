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
exports.Session = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const channel_entity_1 = require("../channel/channel.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const entity_id_decorator_1 = require("../entity-id.decorator");
const order_entity_1 = require("../order/order.entity");
/**
 * @description
 * A Session is created when a user makes a request to restricted API operations. A Session can be an {@link AnonymousSession}
 * in the case of un-authenticated users, otherwise it is an {@link AuthenticatedSession}.
 *
 * @docsCategory entities
 */
let Session = class Session extends base_entity_1.VendureEntity {
};
exports.Session = Session;
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Session.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Session.prototype, "expires", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Session.prototype, "invalidated", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], Session.prototype, "activeOrderId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => order_entity_1.Order),
    __metadata("design:type", Object)
], Session.prototype, "activeOrder", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], Session.prototype, "activeChannelId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => channel_entity_1.Channel),
    __metadata("design:type", Object)
], Session.prototype, "activeChannel", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomSessionFields),
    __metadata("design:type", custom_entity_fields_1.CustomSessionFields)
], Session.prototype, "customFields", void 0);
exports.Session = Session = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.TableInheritance)({ column: { type: 'varchar', name: 'type' } })
], Session);
//# sourceMappingURL=session.entity.js.map