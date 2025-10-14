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
exports.Province = void 0;
const typeorm_1 = require("typeorm");
const region_entity_1 = require("./region.entity");
/**
 * @description
 * A Province represents an administrative subdivision of a {@link Country}. For example, in the
 * United States, the country would be "United States" and the province would be "California".
 *
 * @docsCategory entities
 */
let Province = class Province extends region_entity_1.Region {
    constructor(input) {
        super(input);
        this.type = 'province';
    }
};
exports.Province = Province;
exports.Province = Province = __decorate([
    (0, typeorm_1.ChildEntity)(),
    __metadata("design:paramtypes", [Object])
], Province);
//# sourceMappingURL=province.entity.js.map