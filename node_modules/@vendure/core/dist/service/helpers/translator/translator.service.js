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
exports.TranslatorService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../../../config");
const translate_entity_1 = require("../utils/translate-entity");
/**
 * @description
 * The TranslatorService is used to translate entities into the current language.
 *
 * @example
 * ```ts
 * import { Injectable } from '\@nestjs/common';
 * import { ID, Product, RequestContext, TransactionalConnection, TranslatorService } from '\@vendure/core';
 *
 * \@Injectable()
 * export class ProductService {
 *
 *     constructor(private connection: TransactionalConnection,
 *                 private translator: TranslatorService){}
 *
 *     async findOne(ctx: RequestContext, productId: ID): Promise<Product | undefined> {
 *         const product = await this.connection.findOneInChannel(ctx, Product, productId, ctx.channelId, {
 *             relations: {
 *                  facetValues: {
 *                      facet: true,
 *                  }
 *             }
 *         });
 *         if (!product) {
 *             return;
 *         }
 *         return this.translator.translate(product, ctx, ['facetValues', ['facetValues', 'facet']]);
 *     }
 * }
 * ```
 *
 * @docsCategory service-helpers
 */
let TranslatorService = class TranslatorService {
    constructor(configService) {
        this.configService = configService;
    }
    translate(translatable, ctx, translatableRelations = []) {
        return (0, translate_entity_1.translateDeep)(translatable, [ctx.languageCode, ctx.channel.defaultLanguageCode, this.configService.defaultLanguageCode], translatableRelations);
    }
};
exports.TranslatorService = TranslatorService;
exports.TranslatorService = TranslatorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TranslatorService);
//# sourceMappingURL=translator.service.js.map