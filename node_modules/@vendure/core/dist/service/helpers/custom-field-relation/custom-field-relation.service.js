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
exports.CustomFieldRelationService = void 0;
const common_1 = require("@nestjs/common");
const pick_1 = require("@vendure/common/lib/pick");
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const typeorm_1 = require("typeorm");
const config_service_1 = require("../../../config/config.service");
const transactional_connection_1 = require("../../../connection/transactional-connection");
let CustomFieldRelationService = class CustomFieldRelationService {
    constructor(connection, configService) {
        this.connection = connection;
        this.configService = configService;
    }
    /**
     * @description
     * If the entity being created or updated has any custom fields of type `relation`, this
     * method will get the values from the input object and persist those relations in the
     * database.
     */
    async updateRelations(ctx, entityType, input, entity) {
        if (input.customFields) {
            const relationCustomFields = this.configService.customFields[entityType.name].filter(this.isRelationalType);
            for (const field of relationCustomFields) {
                const inputIdName = (0, shared_utils_1.getGraphQlInputName)(field);
                const idOrIds = input.customFields[inputIdName];
                if (idOrIds !== undefined) {
                    let relations;
                    if (idOrIds === null) {
                        // an explicitly `null` value means remove the relation
                        relations = null;
                    }
                    else if (field.list && Array.isArray(idOrIds) && idOrIds.every(id => this.isId(id))) {
                        relations = await this.connection
                            .getRepository(ctx, field.entity)
                            .findBy({ id: (0, typeorm_1.In)(idOrIds) });
                    }
                    else if (!field.list && this.isId(idOrIds)) {
                        relations = await this.connection
                            .getRepository(ctx, field.entity)
                            .findOne({ where: { id: idOrIds } });
                    }
                    if (relations !== undefined) {
                        const entityWithCustomFields = await this.connection
                            .getRepository(ctx, entityType)
                            .findOne({ where: { id: entity.id }, loadEagerRelations: false });
                        entity.customFields = Object.assign(Object.assign(Object.assign({}, entity.customFields), entityWithCustomFields === null || entityWithCustomFields === void 0 ? void 0 : entityWithCustomFields.customFields), { [field.name]: relations });
                        await this.connection
                            .getRepository(ctx, entityType)
                            .save((0, pick_1.pick)(entity, ['id', 'customFields']), { reload: false });
                    }
                }
            }
        }
        return entity;
    }
    isRelationalType(input) {
        return input.type === 'relation';
    }
    isId(input) {
        return typeof input === 'string' || typeof input === 'number';
    }
};
exports.CustomFieldRelationService = CustomFieldRelationService;
exports.CustomFieldRelationService = CustomFieldRelationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        config_service_1.ConfigService])
], CustomFieldRelationService);
//# sourceMappingURL=custom-field-relation.service.js.map