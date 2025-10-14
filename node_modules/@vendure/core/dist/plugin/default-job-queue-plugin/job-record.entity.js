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
exports.JobRecord = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../entity/base/base.entity");
// createdAt is coming from base entity VendureEntity and is not explicitly defined here
let JobRecord = class JobRecord extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.JobRecord = JobRecord;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobRecord.prototype, "queueName", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], JobRecord.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], JobRecord.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], JobRecord.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], JobRecord.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobRecord.prototype, "error", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, precision: 6 }),
    __metadata("design:type", Date)
], JobRecord.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, precision: 6 }),
    __metadata("design:type", Date)
], JobRecord.prototype, "settledAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], JobRecord.prototype, "isSettled", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], JobRecord.prototype, "retries", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], JobRecord.prototype, "attempts", void 0);
exports.JobRecord = JobRecord = __decorate([
    (0, typeorm_1.Index)(['createdAt']),
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], JobRecord);
//# sourceMappingURL=job-record.entity.js.map