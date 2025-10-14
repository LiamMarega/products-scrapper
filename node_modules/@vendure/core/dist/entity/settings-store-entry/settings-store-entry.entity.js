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
exports.SettingsStoreEntry = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
/**
 * @description
 * An entity for storing arbitrary settings data with scoped isolation.
 * This is used by the SettingsStore system to provide flexible key-value storage
 * with support for user, channel, and custom scoping.
 *
 * @docsCategory entities
 * @docsPage SettingsStoreEntry
 * @since 3.4.0
 */
let SettingsStoreEntry = class SettingsStoreEntry extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.SettingsStoreEntry = SettingsStoreEntry;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SettingsStoreEntry.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
], SettingsStoreEntry.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], SettingsStoreEntry.prototype, "scope", void 0);
exports.SettingsStoreEntry = SettingsStoreEntry = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)('settings_store_key_scope_unique', ['key', 'scope'], { unique: true }),
    __metadata("design:paramtypes", [Object])
], SettingsStoreEntry);
//# sourceMappingURL=settings-store-entry.entity.js.map