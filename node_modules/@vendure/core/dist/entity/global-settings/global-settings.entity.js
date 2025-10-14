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
exports.GlobalSettings = void 0;
const typeorm_1 = require("typeorm");
const __1 = require("..");
const custom_entity_fields_1 = require("../custom-entity-fields");
/**
 * @description Stores global settings for the whole application
 *
 * @docsCategory entities
 */
let GlobalSettings = class GlobalSettings extends __1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.GlobalSettings = GlobalSettings;
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], GlobalSettings.prototype, "availableLanguages", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], GlobalSettings.prototype, "trackInventory", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], GlobalSettings.prototype, "outOfStockThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomGlobalSettingsFields),
    __metadata("design:type", custom_entity_fields_1.CustomGlobalSettingsFields)
], GlobalSettings.prototype, "customFields", void 0);
exports.GlobalSettings = GlobalSettings = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], GlobalSettings);
//# sourceMappingURL=global-settings.entity.js.map