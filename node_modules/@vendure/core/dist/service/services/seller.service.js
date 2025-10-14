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
exports.SellerService = void 0;
const common_1 = require("@nestjs/common");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const instrument_decorator_1 = require("../../common/instrument-decorator");
const utils_1 = require("../../common/utils");
const transactional_connection_1 = require("../../connection/transactional-connection");
const seller_entity_1 = require("../../entity/seller/seller.entity");
const index_1 = require("../../event-bus/index");
const custom_field_relation_service_1 = require("../helpers/custom-field-relation/custom-field-relation.service");
const list_query_builder_1 = require("../helpers/list-query-builder/list-query-builder");
const patch_entity_1 = require("../helpers/utils/patch-entity");
/**
 * @description
 * Contains methods relating to {@link Seller} entities.
 *
 * @docsCategory services
 */
let SellerService = class SellerService {
    constructor(connection, listQueryBuilder, eventBus, customFieldRelationService) {
        this.connection = connection;
        this.listQueryBuilder = listQueryBuilder;
        this.eventBus = eventBus;
        this.customFieldRelationService = customFieldRelationService;
    }
    async initSellers() {
        await this.ensureDefaultSellerExists();
    }
    findAll(ctx, options) {
        return this.listQueryBuilder
            .build(seller_entity_1.Seller, options, { ctx })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
            items,
            totalItems,
        }));
    }
    findOne(ctx, sellerId) {
        return this.connection
            .getRepository(ctx, seller_entity_1.Seller)
            .findOne({ where: { id: sellerId } })
            .then(result => result !== null && result !== void 0 ? result : undefined);
    }
    async create(ctx, input) {
        const seller = await this.connection.getRepository(ctx, seller_entity_1.Seller).save(new seller_entity_1.Seller(input));
        const sellerWithRelations = await this.customFieldRelationService.updateRelations(ctx, seller_entity_1.Seller, input, seller);
        await this.eventBus.publish(new index_1.SellerEvent(ctx, sellerWithRelations, 'created', input));
        return (0, utils_1.assertFound)(this.findOne(ctx, seller.id));
    }
    async update(ctx, input) {
        const seller = await this.connection.getEntityOrThrow(ctx, seller_entity_1.Seller, input.id);
        const updatedSeller = (0, patch_entity_1.patchEntity)(seller, input);
        await this.connection.getRepository(ctx, seller_entity_1.Seller).save(updatedSeller);
        const sellerWithRelations = await this.customFieldRelationService.updateRelations(ctx, seller_entity_1.Seller, input, seller);
        await this.eventBus.publish(new index_1.SellerEvent(ctx, sellerWithRelations, 'updated', input));
        return seller;
    }
    async delete(ctx, id) {
        const seller = await this.connection.getEntityOrThrow(ctx, seller_entity_1.Seller, id);
        await this.connection.getRepository(ctx, seller_entity_1.Seller).remove(seller);
        const deletedSeller = new seller_entity_1.Seller(seller);
        await this.eventBus.publish(new index_1.SellerEvent(ctx, deletedSeller, 'deleted', id));
        return {
            result: generated_types_1.DeletionResult.DELETED,
        };
    }
    async ensureDefaultSellerExists() {
        const sellers = await this.connection.rawConnection.getRepository(seller_entity_1.Seller).find();
        if (sellers.length === 0) {
            await this.connection.rawConnection.getRepository(seller_entity_1.Seller).save(new seller_entity_1.Seller({
                name: 'Default Seller',
            }));
        }
    }
};
exports.SellerService = SellerService;
exports.SellerService = SellerService = __decorate([
    (0, common_1.Injectable)(),
    (0, instrument_decorator_1.Instrument)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        list_query_builder_1.ListQueryBuilder,
        index_1.EventBus,
        custom_field_relation_service_1.CustomFieldRelationService])
], SellerService);
//# sourceMappingURL=seller.service.js.map