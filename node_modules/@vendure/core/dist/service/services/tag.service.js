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
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const unique_1 = require("@vendure/common/lib/unique");
const instrument_decorator_1 = require("../../common/instrument-decorator");
const transactional_connection_1 = require("../../connection/transactional-connection");
const tag_entity_1 = require("../../entity/tag/tag.entity");
const list_query_builder_1 = require("../helpers/list-query-builder/list-query-builder");
/**
 * @description
 * Contains methods relating to {@link Tag} entities.
 *
 * @docsCategory services
 */
let TagService = class TagService {
    constructor(connection, listQueryBuilder) {
        this.connection = connection;
        this.listQueryBuilder = listQueryBuilder;
    }
    findAll(ctx, options) {
        return this.listQueryBuilder
            .build(tag_entity_1.Tag, options, { ctx })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
            items,
            totalItems,
        }));
    }
    findOne(ctx, tagId) {
        return this.connection
            .getRepository(ctx, tag_entity_1.Tag)
            .findOne({ where: { id: tagId } })
            .then(result => result !== null && result !== void 0 ? result : undefined);
    }
    create(ctx, input) {
        return this.tagValueToTag(ctx, input.value);
    }
    async update(ctx, input) {
        const tag = await this.connection.getEntityOrThrow(ctx, tag_entity_1.Tag, input.id);
        if (input.value) {
            tag.value = input.value;
            await this.connection.getRepository(ctx, tag_entity_1.Tag).save(tag);
        }
        return tag;
    }
    async delete(ctx, id) {
        const tag = await this.connection.getEntityOrThrow(ctx, tag_entity_1.Tag, id);
        await this.connection.getRepository(ctx, tag_entity_1.Tag).remove(tag);
        return {
            result: generated_types_1.DeletionResult.DELETED,
        };
    }
    async valuesToTags(ctx, values) {
        const tags = [];
        for (const value of (0, unique_1.unique)(values)) {
            tags.push(await this.tagValueToTag(ctx, value));
        }
        return tags;
    }
    getTagsForEntity(ctx, entity, id) {
        return this.connection
            .getRepository(ctx, entity)
            .createQueryBuilder()
            .relation(entity, 'tags')
            .of(id)
            .loadMany();
    }
    async tagValueToTag(ctx, value) {
        const existing = await this.connection.getRepository(ctx, tag_entity_1.Tag).findOne({ where: { value } });
        if (existing) {
            return existing;
        }
        return await this.connection.getRepository(ctx, tag_entity_1.Tag).save(new tag_entity_1.Tag({ value }));
    }
};
exports.TagService = TagService;
exports.TagService = TagService = __decorate([
    (0, common_1.Injectable)(),
    (0, instrument_decorator_1.Instrument)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        list_query_builder_1.ListQueryBuilder])
], TagService);
//# sourceMappingURL=tag.service.js.map