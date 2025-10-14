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
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const config_helpers_1 = require("./config-helpers");
const vendure_logger_1 = require("./logger/vendure-logger");
let ConfigService = class ConfigService {
    constructor() {
        this.activeConfig = (0, config_helpers_1.getConfig)();
        if (this.activeConfig.authOptions.disableAuth) {
            // eslint-disable-next-line
            vendure_logger_1.Logger.warn('Auth has been disabled. This should never be the case for a production system!');
        }
    }
    get apiOptions() {
        return this.activeConfig.apiOptions;
    }
    get authOptions() {
        return this.activeConfig.authOptions;
    }
    get catalogOptions() {
        return this.activeConfig.catalogOptions;
    }
    get defaultChannelToken() {
        return this.activeConfig.defaultChannelToken;
    }
    get defaultLanguageCode() {
        return this.activeConfig.defaultLanguageCode;
    }
    get entityOptions() {
        return this.activeConfig.entityOptions;
    }
    get entityIdStrategy() {
        return this.activeConfig.entityIdStrategy;
    }
    get assetOptions() {
        return this.activeConfig.assetOptions;
    }
    get dbConnectionOptions() {
        return this.activeConfig.dbConnectionOptions;
    }
    get promotionOptions() {
        return this.activeConfig.promotionOptions;
    }
    get shippingOptions() {
        return this.activeConfig.shippingOptions;
    }
    get orderOptions() {
        return this.activeConfig.orderOptions;
    }
    get paymentOptions() {
        return this.activeConfig.paymentOptions;
    }
    get taxOptions() {
        return this.activeConfig.taxOptions;
    }
    get importExportOptions() {
        return this.activeConfig.importExportOptions;
    }
    get customFields() {
        if (!this.allCustomFieldsConfig) {
            this.allCustomFieldsConfig = this.getCustomFieldsForAllEntities();
        }
        return this.allCustomFieldsConfig;
    }
    get plugins() {
        return this.activeConfig.plugins;
    }
    get logger() {
        return this.activeConfig.logger;
    }
    get jobQueueOptions() {
        return this.activeConfig.jobQueueOptions;
    }
    get schedulerOptions() {
        return this.activeConfig.schedulerOptions;
    }
    get systemOptions() {
        return this.activeConfig.systemOptions;
    }
    get settingsStoreFields() {
        var _a;
        return (_a = this.activeConfig.settingsStoreFields) !== null && _a !== void 0 ? _a : {};
    }
    getCustomFieldsForAllEntities() {
        const definedCustomFields = this.activeConfig.customFields;
        const metadataArgsStorage = (0, typeorm_1.getMetadataArgsStorage)();
        // We need to check for any entities which have a "customFields" property but which are not
        // explicitly defined in the customFields config. This is because the customFields object
        // only includes the built-in entities. Any custom entities which have a "customFields"
        // must be dynamically added to the customFields object.
        if (Array.isArray(this.dbConnectionOptions.entities)) {
            for (const entity of this.dbConnectionOptions.entities) {
                if (typeof entity === 'function' && !definedCustomFields[entity.name]) {
                    const hasCustomFields = !!metadataArgsStorage
                        .filterEmbeddeds(entity)
                        .find(c => c.propertyName === 'customFields');
                    const isTranslationEntity = entity.name.endsWith('Translation') &&
                        metadataArgsStorage
                            .filterColumns(entity)
                            .find(c => c.propertyName === 'languageCode');
                    if (hasCustomFields && !isTranslationEntity) {
                        definedCustomFields[entity.name] = [];
                    }
                }
            }
        }
        return definedCustomFields;
    }
    /**
     * This is a precaution against attempting to JSON.stringify() a reference to
     * this class, which can lead to a circular reference error.
     */
    toJSON() {
        return {};
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ConfigService);
//# sourceMappingURL=config.service.js.map