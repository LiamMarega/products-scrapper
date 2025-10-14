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
exports.CustomFieldProcessingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const graphql_2 = require("graphql");
const injector_1 = require("../../common/injector");
const config_service_1 = require("../../config/config.service");
const parse_context_1 = require("../common/parse-context");
const request_context_1 = require("../common/request-context");
const validate_custom_field_value_1 = require("../common/validate-custom-field-value");
/**
 * @description
 * Unified interceptor that processes custom fields in GraphQL mutations by:
 *
 * 1. Applying default values when fields are explicitly set to null (create operations only)
 * 2. Validating custom field values according to their constraints
 *
 * Uses native GraphQL utilities (visit, visitWithTypeInfo, getNamedType) for efficient
 * AST traversal and type analysis.
 */
let CustomFieldProcessingInterceptor = class CustomFieldProcessingInterceptor {
    constructor(configService, moduleRef) {
        this.configService = configService;
        this.moduleRef = moduleRef;
        this.createInputsWithCustomFields = new Set();
        this.updateInputsWithCustomFields = new Set();
        Object.keys(configService.customFields).forEach(entityName => {
            this.createInputsWithCustomFields.add(`Create${entityName}Input`);
            this.updateInputsWithCustomFields.add(`Update${entityName}Input`);
        });
        // Note: OrderLineCustomFieldsInput is handled separately since it's used in both
        // create operations (addItemToOrder) and update operations (adjustOrderLine)
    }
    async intercept(context, next) {
        const parsedContext = (0, parse_context_1.parseContext)(context);
        if (!parsedContext.isGraphQL) {
            return next.handle();
        }
        const { operation, schema } = parsedContext.info;
        if (operation.operation === 'mutation') {
            await this.processMutationCustomFields(context, operation, schema);
        }
        return next.handle();
    }
    async processMutationCustomFields(context, operation, schema) {
        const gqlExecutionContext = graphql_1.GqlExecutionContext.create(context);
        const variables = gqlExecutionContext.getArgs();
        const ctx = (0, request_context_1.internal_getRequestContext)((0, parse_context_1.parseContext)(context).req);
        const injector = new injector_1.Injector(this.moduleRef);
        const inputTypeNames = this.getArgumentMap(operation, schema);
        for (const [inputName, typeName] of Object.entries(inputTypeNames)) {
            if (this.hasCustomFields(typeName) && variables[inputName]) {
                await this.processInputVariables(typeName, variables[inputName], ctx, injector, operation);
            }
        }
    }
    hasCustomFields(typeName) {
        return (this.createInputsWithCustomFields.has(typeName) ||
            this.updateInputsWithCustomFields.has(typeName) ||
            typeName === 'OrderLineCustomFieldsInput');
    }
    async processInputVariables(typeName, variableInput, ctx, injector, operation) {
        const inputVariables = Array.isArray(variableInput) ? variableInput : [variableInput];
        const shouldApplyDefaults = this.shouldApplyDefaults(typeName, operation);
        for (const inputVariable of inputVariables) {
            if (shouldApplyDefaults) {
                this.applyDefaultsToInput(typeName, inputVariable);
            }
            await this.validateInput(typeName, ctx, injector, inputVariable);
        }
    }
    shouldApplyDefaults(typeName, operation) {
        // For regular create inputs, always apply defaults
        if (this.createInputsWithCustomFields.has(typeName)) {
            return true;
        }
        // For OrderLineCustomFieldsInput, check the actual mutation name
        if (typeName === 'OrderLineCustomFieldsInput') {
            return this.isOrderLineCreateOperation(operation);
        }
        // For update inputs, never apply defaults
        return false;
    }
    isOrderLineCreateOperation(operation) {
        // Check if any field in the operation is a "create/add" operation for order lines
        for (const selection of operation.selectionSet.selections) {
            if (selection.kind === 'Field') {
                const fieldName = selection.name.value;
                // These mutations create new order lines, so should apply defaults
                if (fieldName === 'addItemToOrder' || fieldName === 'addItemToDraftOrder') {
                    return true;
                }
                // These mutations modify existing order lines, so should NOT apply defaults
                if (fieldName === 'adjustOrderLine' || fieldName === 'adjustDraftOrderLine') {
                    return false;
                }
            }
        }
        // Default to false for safety (don't apply defaults unless we're sure it's a create)
        return false;
    }
    getArgumentMap(operation, schema) {
        const typeInfo = new graphql_2.TypeInfo(schema);
        const map = {};
        const visitor = {
            enter(node) {
                if (node.kind === 'Field') {
                    const fieldDef = typeInfo.getFieldDef();
                    if (fieldDef) {
                        for (const arg of fieldDef.args) {
                            map[arg.name] = (0, graphql_2.getNamedType)(arg.type).name;
                        }
                    }
                }
            },
        };
        (0, graphql_2.visit)(operation, (0, graphql_2.visitWithTypeInfo)(typeInfo, visitor));
        return map;
    }
    applyDefaultsToInput(typeName, variableValues) {
        if (typeName === 'OrderLineCustomFieldsInput') {
            this.applyDefaultsForOrderLine(variableValues);
        }
        else {
            this.applyDefaultsForEntity(typeName, variableValues);
        }
    }
    applyDefaultsForOrderLine(variableValues) {
        const orderLineConfig = this.configService.customFields.OrderLine || [];
        this.applyDefaultsToCustomFieldsObject(orderLineConfig, variableValues);
    }
    applyDefaultsForEntity(typeName, variableValues) {
        const entityName = this.getEntityNameFromInputType(typeName);
        const customFieldConfig = this.configService.customFields[entityName];
        if (!customFieldConfig) {
            return;
        }
        this.applyDefaultsToDirectCustomFields(customFieldConfig, variableValues);
        this.applyDefaultsToTranslationCustomFields(customFieldConfig, variableValues);
    }
    applyDefaultsToDirectCustomFields(customFieldConfig, variableValues) {
        if (variableValues.customFields) {
            this.applyDefaultsToCustomFieldsObject(customFieldConfig, variableValues.customFields);
        }
    }
    applyDefaultsToTranslationCustomFields(customFieldConfig, variableValues) {
        if (!variableValues.translations || !Array.isArray(variableValues.translations)) {
            return;
        }
        for (const translation of variableValues.translations) {
            if (translation.customFields) {
                this.applyDefaultsToCustomFieldsObject(customFieldConfig, translation.customFields);
            }
        }
    }
    applyDefaultsToCustomFieldsObject(customFieldConfig, customFieldsObject) {
        for (const config of customFieldConfig) {
            const fieldName = (0, shared_utils_1.getGraphQlInputName)(config);
            // Only apply default if the field is explicitly null and has a default value
            if (customFieldsObject[fieldName] === null && config.defaultValue !== undefined) {
                customFieldsObject[fieldName] = config.defaultValue;
            }
        }
    }
    getEntityNameFromInputType(typeName) {
        // Remove "Create" or "Update" prefix and "Input" suffix
        // e.g., "CreateProductInput" -> "Product", "UpdateCustomerInput" -> "Customer"
        if (typeName.startsWith('Create')) {
            return typeName.slice(6, -5); // Remove "Create" and "Input"
        }
        if (typeName.startsWith('Update')) {
            return typeName.slice(6, -5); // Remove "Update" and "Input"
        }
        return typeName;
    }
    async validateInput(typeName, ctx, injector, variableValues) {
        if (variableValues) {
            const entityName = typeName.replace(/(Create|Update)(.+)Input/, '$2');
            const customFieldConfig = this.configService.customFields[entityName];
            if (typeName === 'OrderLineCustomFieldsInput') {
                // special case needed to handle custom fields passed via addItemToOrder or adjustOrderLine
                // mutations.
                await this.validateCustomFieldsObject(this.configService.customFields.OrderLine, ctx, variableValues, injector);
            }
            if (variableValues.customFields) {
                await this.validateCustomFieldsObject(customFieldConfig, ctx, variableValues.customFields, injector);
            }
            const translations = variableValues.translations;
            if (Array.isArray(translations)) {
                for (const translation of translations) {
                    if (translation.customFields) {
                        await this.validateCustomFieldsObject(customFieldConfig, ctx, translation.customFields, injector);
                    }
                }
            }
        }
    }
    async validateCustomFieldsObject(customFieldConfig, ctx, customFieldsObject, injector) {
        for (const [key, value] of Object.entries(customFieldsObject)) {
            const config = customFieldConfig.find(c => (0, shared_utils_1.getGraphQlInputName)(c) === key);
            if (config) {
                await (0, validate_custom_field_value_1.validateCustomFieldValue)(config, value, injector, ctx);
            }
        }
    }
};
exports.CustomFieldProcessingInterceptor = CustomFieldProcessingInterceptor;
exports.CustomFieldProcessingInterceptor = CustomFieldProcessingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        core_1.ModuleRef])
], CustomFieldProcessingInterceptor);
//# sourceMappingURL=custom-field-processing-interceptor.js.map