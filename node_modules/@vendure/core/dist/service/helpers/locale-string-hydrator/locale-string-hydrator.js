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
exports.LocaleStringHydrator = void 0;
const common_1 = require("@nestjs/common");
const request_context_cache_service_1 = require("../../../cache/request-context-cache.service");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const translator_service_1 = require("../translator/translator.service");
/**
 * This helper class is to be used in GraphQL entity resolvers, to resolve fields which depend on being
 * translated (i.e. the corresponding entity field is of type `LocaleString`).
 */
let LocaleStringHydrator = class LocaleStringHydrator {
    constructor(connection, requestCache, translator) {
        this.connection = connection;
        this.requestCache = requestCache;
        this.translator = translator;
    }
    async hydrateLocaleStringField(ctx, entity, fieldName) {
        if (entity[fieldName]) {
            // Already hydrated, so return the value
            return entity[fieldName];
        }
        await this.hydrateLocaleStrings(ctx, entity);
        return entity[fieldName];
    }
    /**
     * Takes a translatable entity and populates all the LocaleString fields
     * by fetching the translations from the database (they will be eagerly loaded).
     *
     * This method includes a caching optimization to prevent multiple DB calls when many
     * translatable fields are needed on the same entity in a resolver.
     */
    async hydrateLocaleStrings(ctx, entity) {
        var _a, _b, _c;
        const entityType = entity.constructor.name;
        if (!((_a = entity.translations) === null || _a === void 0 ? void 0 : _a.length)) {
            const cacheKey = `hydrate-${entityType}-${entity.id}`;
            let dbCallPromise = this.requestCache.get(ctx, cacheKey);
            if (!dbCallPromise) {
                dbCallPromise = this.connection
                    .getRepository(ctx, entityType)
                    .findOne({ where: { id: entity.id } });
                this.requestCache.set(ctx, cacheKey, dbCallPromise);
            }
            await dbCallPromise.then(withTranslations => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                entity.translations = withTranslations.translations;
            });
        }
        if (entity.translations.length) {
            const translated = this.translator.translate(entity, ctx);
            for (const localeStringProp of Object.keys(entity.translations[0])) {
                if (localeStringProp === 'base' ||
                    localeStringProp === 'id' ||
                    localeStringProp === 'createdAt' ||
                    localeStringProp === 'updatedAt') {
                    continue;
                }
                if (localeStringProp === 'customFields') {
                    entity[localeStringProp] = Object.assign((_b = entity[localeStringProp]) !== null && _b !== void 0 ? _b : {}, (_c = translated[localeStringProp]) !== null && _c !== void 0 ? _c : {});
                }
                else {
                    entity[localeStringProp] = translated[localeStringProp];
                }
            }
        }
        return entity;
    }
};
exports.LocaleStringHydrator = LocaleStringHydrator;
exports.LocaleStringHydrator = LocaleStringHydrator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        request_context_cache_service_1.RequestContextCacheService,
        translator_service_1.TranslatorService])
], LocaleStringHydrator);
//# sourceMappingURL=locale-string-hydrator.js.map