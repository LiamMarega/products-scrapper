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
exports.TaxCategoryService = void 0;
const common_1 = require("@nestjs/common");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const errors_1 = require("../../common/error/errors");
const instrument_decorator_1 = require("../../common/instrument-decorator");
const utils_1 = require("../../common/utils");
const transactional_connection_1 = require("../../connection/transactional-connection");
const tax_category_entity_1 = require("../../entity/tax-category/tax-category.entity");
const tax_rate_entity_1 = require("../../entity/tax-rate/tax-rate.entity");
const event_bus_1 = require("../../event-bus");
const tax_category_event_1 = require("../../event-bus/events/tax-category-event");
const list_query_builder_1 = require("../helpers/list-query-builder/list-query-builder");
const patch_entity_1 = require("../helpers/utils/patch-entity");
/**
 * @description
 * Contains methods relating to {@link TaxCategory} entities.
 *
 * @docsCategory services
 */
let TaxCategoryService = class TaxCategoryService {
    constructor(connection, eventBus, listQueryBuilder) {
        this.connection = connection;
        this.eventBus = eventBus;
        this.listQueryBuilder = listQueryBuilder;
    }
    findAll(ctx, options) {
        return this.listQueryBuilder
            .build(tax_category_entity_1.TaxCategory, options, { ctx })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
            items,
            totalItems,
        }));
    }
    findOne(ctx, taxCategoryId) {
        return this.connection
            .getRepository(ctx, tax_category_entity_1.TaxCategory)
            .findOne({ where: { id: taxCategoryId } })
            .then(result => result !== null && result !== void 0 ? result : undefined);
    }
    async create(ctx, input) {
        const taxCategory = new tax_category_entity_1.TaxCategory(input);
        if (input.isDefault === true) {
            await this.connection
                .getRepository(ctx, tax_category_entity_1.TaxCategory)
                .update({ isDefault: true }, { isDefault: false });
        }
        const newTaxCategory = await this.connection.getRepository(ctx, tax_category_entity_1.TaxCategory).save(taxCategory);
        await this.eventBus.publish(new tax_category_event_1.TaxCategoryEvent(ctx, newTaxCategory, 'created', input));
        return (0, utils_1.assertFound)(this.findOne(ctx, newTaxCategory.id));
    }
    async update(ctx, input) {
        const taxCategory = await this.findOne(ctx, input.id);
        if (!taxCategory) {
            throw new errors_1.EntityNotFoundError('TaxCategory', input.id);
        }
        const updatedTaxCategory = (0, patch_entity_1.patchEntity)(taxCategory, input);
        if (input.isDefault === true) {
            await this.connection
                .getRepository(ctx, tax_category_entity_1.TaxCategory)
                .update({ isDefault: true }, { isDefault: false });
        }
        await this.connection.getRepository(ctx, tax_category_entity_1.TaxCategory).save(updatedTaxCategory, { reload: false });
        await this.eventBus.publish(new tax_category_event_1.TaxCategoryEvent(ctx, taxCategory, 'updated', input));
        return (0, utils_1.assertFound)(this.findOne(ctx, taxCategory.id));
    }
    async delete(ctx, id) {
        const taxCategory = await this.connection.getEntityOrThrow(ctx, tax_category_entity_1.TaxCategory, id);
        const dependentRates = await this.connection
            .getRepository(ctx, tax_rate_entity_1.TaxRate)
            .count({ where: { category: { id } } });
        if (0 < dependentRates) {
            const message = ctx.translate('message.cannot-remove-tax-category-due-to-tax-rates', {
                name: taxCategory.name,
                count: dependentRates,
            });
            return {
                result: generated_types_1.DeletionResult.NOT_DELETED,
                message,
            };
        }
        try {
            const deletedTaxCategory = new tax_category_entity_1.TaxCategory(taxCategory);
            await this.connection.getRepository(ctx, tax_category_entity_1.TaxCategory).remove(taxCategory);
            await this.eventBus.publish(new tax_category_event_1.TaxCategoryEvent(ctx, deletedTaxCategory, 'deleted', id));
            return {
                result: generated_types_1.DeletionResult.DELETED,
            };
        }
        catch (e) {
            return {
                result: generated_types_1.DeletionResult.NOT_DELETED,
                message: e.toString(),
            };
        }
    }
};
exports.TaxCategoryService = TaxCategoryService;
exports.TaxCategoryService = TaxCategoryService = __decorate([
    (0, common_1.Injectable)(),
    (0, instrument_decorator_1.Instrument)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        event_bus_1.EventBus,
        list_query_builder_1.ListQueryBuilder])
], TaxCategoryService);
//# sourceMappingURL=tax-category.service.js.map