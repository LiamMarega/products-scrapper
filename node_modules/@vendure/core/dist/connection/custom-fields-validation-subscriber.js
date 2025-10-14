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
exports.CustomFieldsValidationSubscriber = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("../config/config.service");
const vendure_logger_1 = require("../config/logger/vendure-logger");
const transactional_connection_1 = require("./transactional-connection");
let CustomFieldsValidationSubscriber = class CustomFieldsValidationSubscriber {
    constructor(connection, configService) {
        this.connection = connection;
        this.configService = configService;
        connection.rawConnection.subscribers.push(this);
    }
    validateCustomFields(entityName, entity) {
        const cf = entity.customFields;
        if (cf === null || cf === undefined || typeof cf !== 'object') {
            return;
        }
        const config = this.resolveCustomFieldsConfig(entityName);
        if (!config || config.length === 0) {
            return;
        }
        const validFieldNames = new Set(config.map(field => field.name));
        for (const key of Object.keys(cf)) {
            if (!validFieldNames.has(key)) {
                vendure_logger_1.Logger.warn(`Custom field ${key} not found for entity ${entityName}`);
            }
        }
    }
    resolveCustomFieldsConfig(entityName) {
        let cfg = this.configService.customFields[entityName];
        if (!cfg && entityName.endsWith('Translation')) {
            const base = entityName.slice(0, -'Translation'.length);
            cfg = this.configService.customFields[base];
        }
        return cfg;
    }
    beforeInsert(event) {
        if (event.entity === undefined) {
            return;
        }
        const entityName = event.entity.constructor.name;
        this.validateCustomFields(entityName, event.entity);
    }
    beforeUpdate(event) {
        if (event.entity === undefined) {
            return;
        }
        const entityName = event.entity.constructor.name;
        this.validateCustomFields(entityName, event.entity);
    }
};
exports.CustomFieldsValidationSubscriber = CustomFieldsValidationSubscriber;
exports.CustomFieldsValidationSubscriber = CustomFieldsValidationSubscriber = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        config_service_1.ConfigService])
], CustomFieldsValidationSubscriber);
//# sourceMappingURL=custom-fields-validation-subscriber.js.map