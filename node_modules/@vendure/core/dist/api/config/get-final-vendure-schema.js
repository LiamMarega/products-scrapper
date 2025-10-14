"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinalVendureSchema = getFinalVendureSchema;
exports.buildSchemaFromVendureConfig = buildSchemaFromVendureConfig;
exports.isUsingDefaultEntityIdStrategy = isUsingDefaultEntityIdStrategy;
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const index_1 = require("graphql/index");
const path_1 = __importDefault(require("path"));
const index_2 = require("../../config/index");
const plugin_metadata_1 = require("../../plugin/plugin-metadata");
const generate_active_order_types_1 = require("./generate-active-order-types");
const generate_auth_types_1 = require("./generate-auth-types");
const generate_error_code_enum_1 = require("./generate-error-code-enum");
const generate_list_options_1 = require("./generate-list-options");
const generate_permissions_1 = require("./generate-permissions");
const graphql_custom_fields_1 = require("./graphql-custom-fields");
async function getFinalVendureSchema(options) {
    const { config, typePaths, typesLoader, apiType } = options;
    // Paths must be normalized to use forward-slash separators.
    // See https://github.com/nestjs/graphql/issues/336
    const normalizedPaths = typePaths.map(p => p.split(path_1.default.sep).join('/'));
    const typeDefs = await typesLoader.mergeTypesByPaths(normalizedPaths);
    let schema = (0, index_1.buildSchema)(typeDefs);
    schema = buildSchemaFromVendureConfig(schema, config, apiType);
    if (options.output === 'sdl') {
        return (0, index_1.printSchema)(schema);
    }
    else {
        return schema;
    }
}
function buildSchemaFromVendureConfig(schema, config, apiType) {
    const authStrategies = apiType === 'shop'
        ? config.authOptions.shopAuthenticationStrategy
        : config.authOptions.adminAuthenticationStrategy;
    const customFields = config.customFields;
    schema = extendSchemaWithPluginApiExtensions(schema, config.plugins, apiType);
    schema = (0, generate_list_options_1.generateListOptions)(schema);
    schema = (0, graphql_custom_fields_1.addGraphQLCustomFields)(schema, customFields, apiType === 'shop');
    schema = (0, graphql_custom_fields_1.addOrderLineCustomFieldsInput)(schema, customFields.OrderLine || [], apiType === 'shop');
    schema = (0, graphql_custom_fields_1.addModifyOrderCustomFields)(schema, customFields.Order || []);
    schema = (0, graphql_custom_fields_1.addShippingMethodQuoteCustomFields)(schema, customFields.ShippingMethod || []);
    schema = (0, graphql_custom_fields_1.addPaymentMethodQuoteCustomFields)(schema, customFields.PaymentMethod || []);
    schema = (0, generate_auth_types_1.generateAuthenticationTypes)(schema, authStrategies);
    schema = (0, generate_error_code_enum_1.generateErrorCodeEnum)(schema);
    if (apiType === 'admin') {
        schema = (0, graphql_custom_fields_1.addServerConfigCustomFields)(schema, customFields);
        schema = (0, graphql_custom_fields_1.addActiveAdministratorCustomFields)(schema, customFields.Administrator);
    }
    if (apiType === 'shop') {
        schema = (0, graphql_custom_fields_1.addRegisterCustomerCustomFieldsInput)(schema, customFields.Customer || []);
        schema = (0, generate_active_order_types_1.generateActiveOrderTypes)(schema, config.orderOptions.activeOrderStrategy);
    }
    schema = (0, generate_permissions_1.generatePermissionEnum)(schema, config.authOptions.customPermissions);
    return schema;
}
function extendSchemaWithPluginApiExtensions(schema, plugins, apiType) {
    (0, plugin_metadata_1.getPluginAPIExtensions)(plugins, apiType)
        .map(e => (typeof e.schema === 'function' ? e.schema(schema) : e.schema))
        .filter(shared_utils_1.notNullOrUndefined)
        .forEach(documentNode => (schema = (0, index_1.extendSchema)(schema, documentNode)));
    return schema;
}
function isUsingDefaultEntityIdStrategy(entityIdStrategy) {
    return (entityIdStrategy.constructor === index_2.AutoIncrementIdStrategy ||
        entityIdStrategy.constructor === index_2.UuidIdStrategy);
}
//# sourceMappingURL=get-final-vendure-schema.js.map