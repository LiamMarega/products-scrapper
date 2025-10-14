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
exports.TranslatableSaver = void 0;
const common_1 = require("@nestjs/common");
const omit_1 = require("@vendure/common/lib/omit");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const patch_entity_1 = require("../utils/patch-entity");
const translation_differ_1 = require("./translation-differ");
/**
 * @description
 * A helper which contains methods for creating and updating entities which implement the {@link Translatable} interface.
 *
 * @example
 * ```ts
 * export class MyService {
 *   constructor(private translatableSaver: TranslatableSaver) {}
 *
 *   async create(ctx: RequestContext, input: CreateFacetInput): Promise<Translated<Facet>> {
 *     const facet = await this.translatableSaver.create({
 *       ctx,
 *       input,
 *       entityType: Facet,
 *       translationType: FacetTranslation,
 *       beforeSave: async f => {
 *           f.code = await this.ensureUniqueCode(ctx, f.code);
 *       },
 *     });
 *     return facet;
 *   }
 *
 *   // ...
 * }
 * ```
 *
 * @docsCategory service-helpers
 */
let TranslatableSaver = class TranslatableSaver {
    constructor(connection) {
        this.connection = connection;
    }
    /**
     * @description
     * Create a translatable entity, including creating any translation entities according
     * to the `translations` array.
     */
    async create(options) {
        const { ctx, entityType, translationType, input, beforeSave, typeOrmSubscriberData } = options;
        const entity = new entityType(input);
        const translations = [];
        if (input.translations) {
            for (const translationInput of input.translations) {
                const translation = new translationType(translationInput);
                translations.push(translation);
                await this.connection.getRepository(ctx, translationType).save(translation);
            }
        }
        entity.translations = translations;
        if (typeof beforeSave === 'function') {
            await beforeSave(entity);
        }
        return await this.connection
            .getRepository(ctx, entityType)
            .save(entity, { data: typeOrmSubscriberData });
    }
    /**
     * @description
     * Update a translatable entity. Performs a diff of the `translations` array in order to
     * perform the correct operation on the translations.
     */
    async update(options) {
        const { ctx, entityType, translationType, input, beforeSave, typeOrmSubscriberData } = options;
        const existingTranslations = await this.connection.getRepository(ctx, translationType).find({
            relationLoadStrategy: 'query',
            loadEagerRelations: false,
            where: { base: { id: input.id } },
            relations: ['base'],
        });
        const differ = new translation_differ_1.TranslationDiffer(translationType, this.connection);
        const diff = differ.diff(existingTranslations, input.translations);
        const entity = await differ.applyDiff(ctx, new entityType(Object.assign(Object.assign({}, input), { translations: existingTranslations })), diff);
        entity.updatedAt = new Date();
        const updatedEntity = (0, patch_entity_1.patchEntity)(entity, (0, omit_1.omit)(input, ['translations']));
        if (typeof beforeSave === 'function') {
            await beforeSave(entity);
        }
        return this.connection
            .getRepository(ctx, entityType)
            .save(updatedEntity, { data: typeOrmSubscriberData });
    }
};
exports.TranslatableSaver = TranslatableSaver;
exports.TranslatableSaver = TranslatableSaver = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection])
], TranslatableSaver);
//# sourceMappingURL=translatable-saver.js.map