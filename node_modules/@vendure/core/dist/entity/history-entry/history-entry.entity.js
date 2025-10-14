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
exports.HistoryEntry = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const administrator_entity_1 = require("../administrator/administrator.entity");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
/**
 * @description
 * An abstract entity representing an entry in the history of an Order ({@link OrderHistoryEntry})
 * or a Customer ({@link CustomerHistoryEntry}).
 *
 * @docsCategory entities
 */
let HistoryEntry = class HistoryEntry extends base_entity_1.VendureEntity {
};
exports.HistoryEntry = HistoryEntry;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => administrator_entity_1.Administrator),
    __metadata("design:type", administrator_entity_1.Administrator)
], HistoryEntry.prototype, "administrator", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar' }),
    __metadata("design:type", String)
], HistoryEntry.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], HistoryEntry.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Object)
], HistoryEntry.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomHistoryEntryFields),
    __metadata("design:type", custom_entity_fields_1.CustomHistoryEntryFields)
], HistoryEntry.prototype, "customFields", void 0);
exports.HistoryEntry = HistoryEntry = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.TableInheritance)({ column: { type: 'varchar', name: 'discriminator' } })
], HistoryEntry);
//# sourceMappingURL=history-entry.entity.js.map