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
exports.VendureEntity = void 0;
const typeorm_1 = require("typeorm");
const entity_id_decorator_1 = require("../entity-id.decorator");
/**
 * @description
 * This is the base class from which all entities inherit. The type of
 * the `id` property is defined by the {@link EntityIdStrategy}.
 *
 * @docsCategory entities
 */
class VendureEntity {
    constructor(input) {
        if (input) {
            for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(input))) {
                if (descriptor.get && !descriptor.set) {
                    // A getter has been moved to the entity instance
                    // by the CalculatedPropertySubscriber
                    // and cannot be copied over to the new instance.
                    continue;
                }
                this[key] = descriptor.value;
            }
        }
    }
}
exports.VendureEntity = VendureEntity;
__decorate([
    (0, entity_id_decorator_1.PrimaryGeneratedId)(),
    __metadata("design:type", Object)
], VendureEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], VendureEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], VendureEntity.prototype, "updatedAt", void 0);
//# sourceMappingURL=base.entity.js.map