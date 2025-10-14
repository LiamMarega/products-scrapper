"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurableOperationDef = void 0;
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const constants_1 = require("./constants");
const errors_1 = require("./error/errors");
/**
 * @description
 * A ConfigurableOperationDef is a special type of object used extensively by Vendure to define
 * code blocks which have arguments which are configurable at run-time by the administrator.
 *
 * This is the mechanism used by:
 *
 * * {@link CollectionFilter}
 * * {@link PaymentMethodHandler}
 * * {@link PromotionAction}
 * * {@link PromotionCondition}
 * * {@link ShippingCalculator}
 * * {@link ShippingEligibilityChecker}
 *
 * Any class which extends ConfigurableOperationDef works in the same way: it takes a
 * config object as the constructor argument. That config object extends the {@link ConfigurableOperationDefOptions}
 * interface and typically adds some kind of business logic function to it.
 *
 * For example, in the case of `ShippingEligibilityChecker`,
 * it adds the `check()` function to the config object which defines the logic for checking whether an Order is eligible
 * for a particular ShippingMethod.
 *
 * ## The `args` property
 *
 * The key feature of the ConfigurableOperationDef is the `args` property. This is where we define those
 * arguments that are exposed via the Admin UI as data input components. This allows their values to
 * be set at run-time by the Administrator. Those values can then be accessed in the business logic
 * of the operation.
 *
 * The data type of the args can be one of {@link ConfigArgType}, and the configuration is further explained in
 * the docs of {@link ConfigArgs}.
 *
 * ## Dependency Injection
 * If your business logic relies on injectable providers, such as the `TransactionalConnection` object, or any of the
 * internal Vendure services or those defined in a plugin, you can inject them by using the config object's
 * `init()` method, which exposes the {@link Injector}.
 *
 * Here's an example of a ShippingCalculator that injects a service which has been defined in a plugin:
 *
 * @example
 * ```ts
 * import { Injector, ShippingCalculator } from '\@vendure/core';
 * import { ShippingRatesService } from './shipping-rates.service';
 *
 * // We keep reference to our injected service by keeping it
 * // in the top-level scope of the file.
 * let shippingRatesService: ShippingRatesService;
 *
 * export const customShippingCalculator = new ShippingCalculator({
 *   code: 'custom-shipping-calculator',
 *   description: [],
 *   args: {},
 *
 *   init(injector: Injector) {
 *     // The init function is called during bootstrap, and allows
 *     // us to inject any providers we need.
 *     shippingRatesService = injector.get(ShippingRatesService);
 *   },
 *
 *   calculate: async (order, args) => {
 *     // We can now use the injected provider in the business logic.
 *     const { price, priceWithTax } = await shippingRatesService.getRate({
 *       destination: order.shippingAddress,
 *       contents: order.lines,
 *     });
 *
 *     return {
 *       price,
 *       priceWithTax,
 *     };
 *   },
 * });
 * ```
 *
 * @docsCategory ConfigurableOperationDef
 */
class ConfigurableOperationDef {
    get code() {
        return this.options.code;
    }
    get args() {
        return this.options.args;
    }
    get description() {
        return this.options.description;
    }
    constructor(options) {
        this.options = options;
    }
    async init(injector) {
        if (typeof this.options.init === 'function') {
            await this.options.init(injector);
        }
    }
    async destroy() {
        if (typeof this.options.destroy === 'function') {
            await this.options.destroy();
        }
    }
    /**
     * @description
     * Convert a ConfigurableOperationDef into a ConfigurableOperationDefinition object, typically
     * so that it can be sent via the API.
     */
    toGraphQlType(ctx) {
        return {
            code: this.code,
            description: localizeString(this.description, ctx.languageCode, ctx.channel.defaultLanguageCode),
            args: Object.entries(this.args).map(([name, arg]) => {
                var _a, _b;
                return ({
                    name,
                    type: arg.type,
                    list: (_a = arg.list) !== null && _a !== void 0 ? _a : false,
                    required: (_b = arg.required) !== null && _b !== void 0 ? _b : true,
                    defaultValue: arg.defaultValue,
                    ui: arg.ui,
                    label: arg.label &&
                        localizeString(arg.label, ctx.languageCode, ctx.channel.defaultLanguageCode),
                    description: arg.description &&
                        localizeString(arg.description, ctx.languageCode, ctx.channel.defaultLanguageCode),
                });
            }),
        };
    }
    /**
     * @description
     * Coverts an array of ConfigArgs into a hash object:
     *
     * from:
     * `[{ name: 'foo', type: 'string', value: 'bar'}]`
     *
     * to:
     * `{ foo: 'bar' }`
     **/
    argsArrayToHash(args) {
        const output = {};
        for (const arg of args) {
            if (arg && arg.value != null && this.args[arg.name] != null) {
                output[arg.name] = coerceValueToType(arg.value, this.args[arg.name].type, this.args[arg.name].list || false);
            }
        }
        return output;
    }
}
exports.ConfigurableOperationDef = ConfigurableOperationDef;
function localizeString(stringArray, languageCode, channelLanguageCode) {
    let match = stringArray.find(x => x.languageCode === languageCode);
    if (!match) {
        match = stringArray.find(x => x.languageCode === channelLanguageCode);
    }
    if (!match) {
        match = stringArray.find(x => x.languageCode === constants_1.DEFAULT_LANGUAGE_CODE);
    }
    if (!match) {
        match = stringArray[0];
    }
    return match.value;
}
function coerceValueToType(value, type, isList) {
    if (isList) {
        try {
            return JSON.parse(value).map(v => coerceValueToType(v, type, false));
        }
        catch (err) {
            throw new errors_1.InternalServerError(`Could not parse list value "${value}": ` + JSON.stringify(err.message));
        }
    }
    switch (type) {
        case 'string':
            return value;
        case 'int':
            return Number.parseInt(value || '', 10);
        case 'float':
            return Number.parseFloat(value || '');
        case 'datetime':
            return Date.parse(value || '');
        case 'boolean':
            return !!(value && (value.toLowerCase() === 'true' || value === '1'));
        case 'ID':
            return value;
        default:
            (0, shared_utils_1.assertNever)(type);
    }
}
//# sourceMappingURL=configurable-operation.js.map