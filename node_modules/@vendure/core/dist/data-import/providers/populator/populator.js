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
exports.Populator = void 0;
const common_1 = require("@nestjs/common");
const normalize_string_1 = require("@vendure/common/lib/normalize-string");
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const request_context_1 = require("../../../api/common/request-context");
const config_1 = require("../../../config");
const manual_fulfillment_handler_1 = require("../../../config/fulfillment/manual-fulfillment-handler");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const entity_1 = require("../../../entity");
const service_1 = require("../../../service");
const channel_service_1 = require("../../../service/services/channel.service");
const country_service_1 = require("../../../service/services/country.service");
const search_service_1 = require("../../../service/services/search.service");
const tax_category_service_1 = require("../../../service/services/tax-category.service");
const tax_rate_service_1 = require("../../../service/services/tax-rate.service");
const zone_service_1 = require("../../../service/services/zone.service");
const asset_importer_1 = require("../asset-importer/asset-importer");
/**
 * @description
 * Responsible for populating the database with {@link InitialData}, i.e. non-product data such as countries, tax rates,
 * shipping methods, payment methods & roles.
 *
 * @docsCategory import-export
 */
let Populator = class Populator {
    /** @internal */
    constructor(countryService, zoneService, channelService, taxRateService, taxCategoryService, shippingMethodService, paymentMethodService, collectionService, facetValueService, searchService, assetImporter, roleService, configService, connection, requestContextService) {
        this.countryService = countryService;
        this.zoneService = zoneService;
        this.channelService = channelService;
        this.taxRateService = taxRateService;
        this.taxCategoryService = taxCategoryService;
        this.shippingMethodService = shippingMethodService;
        this.paymentMethodService = paymentMethodService;
        this.collectionService = collectionService;
        this.facetValueService = facetValueService;
        this.searchService = searchService;
        this.assetImporter = assetImporter;
        this.roleService = roleService;
        this.configService = configService;
        this.connection = connection;
        this.requestContextService = requestContextService;
    }
    /**
     * @description
     * Should be run *before* populating the products, so that there are TaxRates by which
     * product prices can be set. If the `channel` argument is set, then any {@link ChannelAware}
     * entities will be assigned to that Channel.
     */
    async populateInitialData(data, channel) {
        const ctx = await this.createRequestContext(data, channel);
        let zoneMap;
        try {
            zoneMap = await this.populateCountries(ctx, data.countries);
        }
        catch (e) {
            config_1.Logger.error('Could not populate countries');
            config_1.Logger.error(e, 'populator', e.stack);
            throw e;
        }
        try {
            await this.populateTaxRates(ctx, data.taxRates, zoneMap);
        }
        catch (e) {
            config_1.Logger.error('Could not populate tax rates');
            config_1.Logger.error(e, 'populator', e.stack);
        }
        try {
            await this.populateShippingMethods(ctx, data.shippingMethods);
        }
        catch (e) {
            config_1.Logger.error('Could not populate shipping methods');
            config_1.Logger.error(e, 'populator', e.stack);
        }
        try {
            await this.populatePaymentMethods(ctx, data.paymentMethods);
        }
        catch (e) {
            config_1.Logger.error('Could not populate payment methods');
            config_1.Logger.error(e, 'populator', e.stack);
        }
        try {
            await this.setChannelDefaults(zoneMap, data, ctx.channel);
        }
        catch (e) {
            config_1.Logger.error('Could not set channel defaults');
            config_1.Logger.error(e, 'populator', e.stack);
        }
        try {
            await this.populateRoles(ctx, data.roles);
        }
        catch (e) {
            config_1.Logger.error('Could not populate roles');
            config_1.Logger.error(e, 'populator', e.stack);
        }
    }
    /**
     * @description
     * Should be run *after* the products have been populated, otherwise the expected FacetValues will not
     * yet exist.
     */
    async populateCollections(data, channel) {
        var _a, _b;
        const ctx = await this.createRequestContext(data, channel);
        const allFacetValues = await this.facetValueService.findAll(ctx, ctx.languageCode);
        const collectionMap = new Map();
        for (const collectionDef of data.collections) {
            const parent = collectionDef.parentName && collectionMap.get(collectionDef.parentName);
            const parentId = parent ? parent.id.toString() : undefined;
            const { assets } = await this.assetImporter.getAssets(collectionDef.assetPaths || [], ctx);
            let filters = [];
            try {
                filters = (collectionDef.filters || []).map(filter => this.processFilterDefinition(filter, allFacetValues));
            }
            catch (e) {
                config_1.Logger.error(e.message);
            }
            const collection = await this.collectionService.create(ctx, {
                translations: [
                    {
                        languageCode: ctx.languageCode,
                        name: collectionDef.name,
                        description: collectionDef.description || '',
                        slug: (_a = collectionDef.slug) !== null && _a !== void 0 ? _a : collectionDef.name,
                    },
                ],
                isPrivate: collectionDef.private || false,
                parentId,
                assetIds: assets.map(a => a.id.toString()),
                featuredAssetId: assets.length ? assets[0].id.toString() : undefined,
                filters,
                inheritFilters: (_b = collectionDef.inheritFilters) !== null && _b !== void 0 ? _b : true,
            });
            collectionMap.set(collectionDef.name, collection);
        }
        // Wait for the created collection operations to complete before running
        // the reindex of the search index.
        await new Promise(resolve => setTimeout(resolve, 50));
        await this.searchService.reindex(ctx);
    }
    processFilterDefinition(filter, allFacetValues) {
        switch (filter.code) {
            case 'facet-value-filter':
                const facetValueIds = filter.args.facetValueNames
                    .map(name => allFacetValues.find(fv => {
                    let facetName;
                    let valueName = name;
                    if (name.includes(':')) {
                        [facetName, valueName] = name.split(':');
                        return ((fv.name === valueName || fv.code === valueName) &&
                            (fv.facet.name === facetName || fv.facet.code === facetName));
                    }
                    else {
                        return fv.name === valueName || fv.code === valueName;
                    }
                }))
                    .filter(shared_utils_1.notNullOrUndefined)
                    .map(fv => fv.id);
                return {
                    code: filter.code,
                    arguments: [
                        {
                            name: 'facetValueIds',
                            value: JSON.stringify(facetValueIds),
                        },
                        {
                            name: 'containsAny',
                            value: filter.args.containsAny.toString(),
                        },
                    ],
                };
            default:
                throw new Error(`Filter with code "${filter.code}" is not recognized.`);
        }
    }
    async createRequestContext(data, channel) {
        const { superadminCredentials } = this.configService.authOptions;
        const superAdminUser = await this.connection.rawConnection.getRepository(entity_1.User).findOne({
            where: {
                identifier: superadminCredentials.identifier,
            },
        });
        const ctx = await this.requestContextService.create({
            user: superAdminUser !== null && superAdminUser !== void 0 ? superAdminUser : undefined,
            apiType: 'admin',
            languageCode: data.defaultLanguage,
            channelOrToken: channel !== null && channel !== void 0 ? channel : (await this.channelService.getDefaultChannel()),
        });
        return ctx;
    }
    async setChannelDefaults(zoneMap, data, channel) {
        const defaultZone = zoneMap.get(data.defaultZone);
        if (!defaultZone) {
            throw new Error(`The defaultZone (${data.defaultZone}) did not match any existing or created zone names`);
        }
        const defaultZoneId = defaultZone.entity.id;
        await this.channelService.update(request_context_1.RequestContext.empty(), {
            id: channel.id,
            defaultTaxZoneId: defaultZoneId,
            defaultShippingZoneId: defaultZoneId,
        });
    }
    async populateCountries(ctx, countries) {
        const zoneMap = new Map();
        const existingZones = await this.zoneService.getAllWithMembers(ctx);
        for (const zone of existingZones) {
            zoneMap.set(zone.name, { entity: zone, members: zone.members.map(m => m.id) });
        }
        for (const { name, code, zone } of countries) {
            const countryEntity = await this.countryService.create(ctx, {
                code,
                enabled: true,
                translations: [{ languageCode: ctx.languageCode, name }],
            });
            let zoneItem = zoneMap.get(zone);
            if (!zoneItem) {
                const zoneEntity = await this.zoneService.create(ctx, { name: zone });
                zoneItem = { entity: zoneEntity, members: [] };
                zoneMap.set(zone, zoneItem);
            }
            if (!zoneItem.members.includes(countryEntity.id)) {
                zoneItem.members.push(countryEntity.id);
            }
        }
        // add the countries to the respective zones
        for (const zoneItem of zoneMap.values()) {
            await this.zoneService.addMembersToZone(ctx, {
                zoneId: zoneItem.entity.id,
                memberIds: zoneItem.members,
            });
        }
        return zoneMap;
    }
    async populateTaxRates(ctx, taxRates, zoneMap) {
        for (const taxRate of taxRates) {
            const category = await this.taxCategoryService.create(ctx, { name: taxRate.name });
            for (const { entity } of zoneMap.values()) {
                await this.taxRateService.create(ctx, {
                    zoneId: entity.id,
                    value: taxRate.percentage,
                    categoryId: category.id,
                    name: `${taxRate.name} ${entity.name}`,
                    enabled: true,
                });
            }
        }
    }
    async populateShippingMethods(ctx, shippingMethods) {
        for (const method of shippingMethods) {
            await this.shippingMethodService.create(ctx, {
                fulfillmentHandler: manual_fulfillment_handler_1.manualFulfillmentHandler.code,
                checker: {
                    code: config_1.defaultShippingEligibilityChecker.code,
                    arguments: [{ name: 'orderMinimum', value: '0' }],
                },
                calculator: {
                    code: config_1.defaultShippingCalculator.code,
                    arguments: [
                        { name: 'rate', value: method.price.toString() },
                        { name: 'taxRate', value: method.taxRate ? method.taxRate.toString() : '0' },
                        { name: 'includesTax', value: 'auto' },
                    ],
                },
                code: (0, normalize_string_1.normalizeString)(method.name, '-'),
                translations: [{ languageCode: ctx.languageCode, name: method.name, description: '' }],
            });
        }
    }
    async populatePaymentMethods(ctx, paymentMethods) {
        for (const method of paymentMethods) {
            await this.paymentMethodService.create(ctx, {
                code: (0, normalize_string_1.normalizeString)(method.name, '-'),
                enabled: true,
                handler: method.handler,
                translations: [{ languageCode: ctx.languageCode, name: method.name, description: '' }],
            });
        }
    }
    async populateRoles(ctx, roles) {
        if (!roles) {
            return;
        }
        for (const roleDef of roles) {
            await this.roleService.create(ctx, roleDef);
        }
    }
};
exports.Populator = Populator;
exports.Populator = Populator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [country_service_1.CountryService,
        zone_service_1.ZoneService,
        channel_service_1.ChannelService,
        tax_rate_service_1.TaxRateService,
        tax_category_service_1.TaxCategoryService,
        service_1.ShippingMethodService,
        service_1.PaymentMethodService,
        service_1.CollectionService,
        service_1.FacetValueService,
        search_service_1.SearchService,
        asset_importer_1.AssetImporter,
        service_1.RoleService,
        config_1.ConfigService,
        transactional_connection_1.TransactionalConnection,
        service_1.RequestContextService])
], Populator);
//# sourceMappingURL=populator.js.map