"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerGroup = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const ms_1 = __importDefault(require("ms"));
const utils_1 = require("../../../common/utils");
const event_bus_1 = require("../../../event-bus/event-bus");
const customer_group_change_event_1 = require("../../../event-bus/events/customer-group-change-event");
const promotion_condition_1 = require("../promotion-condition");
let customerService;
let cacheService;
let subscription;
let groupIdCache;
exports.customerGroup = new promotion_condition_1.PromotionCondition({
    code: 'customer_group',
    description: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Customer is a member of the specified group' }],
    args: {
        customerGroupId: {
            type: 'ID',
            ui: { component: 'customer-group-form-input' },
            label: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Customer group' }],
        },
    },
    async init(injector) {
        // Lazily-imported to avoid circular dependency issues.
        const { CustomerService } = await import('../../../service/services/customer.service.js');
        const { CacheService } = await import('../../../cache/cache.service.js');
        customerService = injector.get(CustomerService);
        cacheService = injector.get(CacheService);
        groupIdCache = cacheService.createCache({
            getKey: id => `PromotionCondition:customer_group:${id}`,
            options: { ttl: (0, ms_1.default)('1 week') },
        });
        subscription = injector
            .get(event_bus_1.EventBus)
            .ofType(customer_group_change_event_1.CustomerGroupChangeEvent)
            .subscribe(async (event) => {
            // When a customer is added to or removed from a group, we need
            // to invalidate the cache for that customer id
            await groupIdCache.delete(event.customers.map(c => c.id));
        });
    },
    destroy() {
        subscription === null || subscription === void 0 ? void 0 : subscription.unsubscribe();
    },
    async check(ctx, order, args) {
        if (!order.customer) {
            return false;
        }
        const customerId = order.customer.id;
        const groupIds = await groupIdCache.get(customerId, async () => {
            const groups = await customerService.getCustomerGroups(ctx, customerId);
            return groups.map(g => g.id);
        });
        return !!groupIds.find(id => (0, utils_1.idsAreEqual)(id, args.customerGroupId));
    },
});
//# sourceMappingURL=customer-group-condition.js.map