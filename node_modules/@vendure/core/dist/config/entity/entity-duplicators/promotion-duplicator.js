"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promotionDuplicator = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const error_result_1 = require("../../../common/error/error-result");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const promotion_entity_1 = require("../../../entity/promotion/promotion.entity");
const promotion_service_1 = require("../../../service/services/promotion.service");
const entity_duplicator_1 = require("../entity-duplicator");
let connection;
let promotionService;
/**
 * @description
 * Duplicates a Promotion
 */
exports.promotionDuplicator = new entity_duplicator_1.EntityDuplicator({
    code: 'promotion-duplicator',
    description: [
        {
            languageCode: generated_types_1.LanguageCode.en,
            value: 'Default duplicator for Promotions',
        },
    ],
    requiresPermission: [generated_types_1.Permission.CreatePromotion],
    forEntities: ['Promotion'],
    args: {},
    init(injector) {
        connection = injector.get(transactional_connection_1.TransactionalConnection);
        promotionService = injector.get(promotion_service_1.PromotionService);
    },
    async duplicate({ ctx, id }) {
        const promotion = await connection.getEntityOrThrow(ctx, promotion_entity_1.Promotion, id);
        const translations = promotion.translations.map(translation => {
            return {
                name: translation.name + ' (copy)',
                description: translation.description,
                languageCode: translation.languageCode,
                customFields: translation.customFields,
            };
        });
        const promotionInput = {
            couponCode: promotion.couponCode,
            startsAt: promotion.startsAt,
            endsAt: promotion.endsAt,
            perCustomerUsageLimit: promotion.perCustomerUsageLimit,
            usageLimit: promotion.usageLimit,
            conditions: promotion.conditions.map(condition => ({
                code: condition.code,
                arguments: condition.args,
            })),
            actions: promotion.actions.map(action => ({
                code: action.code,
                arguments: action.args,
            })),
            enabled: false,
            translations,
            customFields: promotion.customFields,
        };
        const duplicatedPromotion = await promotionService.createPromotion(ctx, promotionInput);
        if ((0, error_result_1.isGraphQlErrorResult)(duplicatedPromotion)) {
            throw new Error(duplicatedPromotion.message);
        }
        return duplicatedPromotion;
    },
});
//# sourceMappingURL=promotion-duplicator.js.map