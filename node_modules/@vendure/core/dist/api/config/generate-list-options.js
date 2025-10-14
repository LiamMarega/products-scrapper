"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateListOptions = generateListOptions;
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const index_js_1 = require("graphql/index.js");
// Using require here to prevent issues when running vitest tests also.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { stitchSchemas, ValidationLevel } = require('@graphql-tools/stitch');
/**
 * Generates ListOptions inputs for queries which return PaginatedList types.
 */
function generateListOptions(typeDefsOrSchema) {
    const schema = typeof typeDefsOrSchema === 'string' ? (0, index_js_1.buildSchema)(typeDefsOrSchema) : typeDefsOrSchema;
    const queryType = schema.getQueryType();
    if (!queryType) {
        return schema;
    }
    const logicalOperatorEnum = schema.getType('LogicalOperator');
    const objectTypes = Object.values(schema.getTypeMap()).filter(index_js_1.isObjectType);
    const allFields = objectTypes.reduce((fields, type) => {
        const typeFields = Object.values(type.getFields()).filter(f => isListQueryType(f.type));
        return [...fields, ...typeFields];
    }, []);
    const generatedTypes = [];
    for (const query of allFields) {
        const targetTypeName = unwrapNonNullType(query.type).toString().replace(/List$/, '');
        const targetType = schema.getType(targetTypeName);
        if (targetType && (0, index_js_1.isObjectType)(targetType)) {
            const sortParameter = createSortParameter(schema, targetType);
            const filterParameter = createFilterParameter(schema, targetType);
            const existingListOptions = schema.getType(`${targetTypeName}ListOptions`);
            const generatedListOptions = new index_js_1.GraphQLInputObjectType({
                name: `${targetTypeName}ListOptions`,
                fields: Object.assign(Object.assign({ skip: {
                        type: index_js_1.GraphQLInt,
                        description: 'Skips the first n results, for use in pagination',
                    }, take: { type: index_js_1.GraphQLInt, description: 'Takes n results, for use in pagination' }, sort: {
                        type: sortParameter,
                        description: 'Specifies which properties to sort the results by',
                    }, filter: { type: filterParameter, description: 'Allows the results to be filtered' } }, (logicalOperatorEnum
                    ? {
                        filterOperator: {
                            type: logicalOperatorEnum,
                            description: 'Specifies whether multiple top-level "filter" fields should be combined ' +
                                'with a logical AND or OR operation. Defaults to AND.',
                        },
                    }
                    : {})), (existingListOptions ? existingListOptions.getFields() : {})),
            });
            if (!query.args.find(a => a.type.toString() === `${targetTypeName}ListOptions`)) {
                query.args = [
                    ...query.args,
                    {
                        name: 'options',
                        type: generatedListOptions,
                        description: null,
                        defaultValue: null,
                        extensions: {},
                        astNode: null,
                        deprecationReason: null,
                    },
                ];
            }
            generatedTypes.push(filterParameter);
            generatedTypes.push(sortParameter);
            generatedTypes.push(generatedListOptions);
        }
    }
    return stitchSchemas({
        subschemas: [schema],
        types: generatedTypes,
        typeMergingOptions: { validationSettings: { validationLevel: ValidationLevel.Off } },
    });
}
function isListQueryType(type) {
    const innerType = unwrapNonNullType(type);
    return (0, index_js_1.isObjectType)(innerType) && !!innerType.getInterfaces().find(i => i.name === 'PaginatedList');
}
function createSortParameter(schema, targetType) {
    const fields = Object.values(targetType.getFields());
    const targetTypeName = targetType.name;
    const SortOrder = schema.getType('SortOrder');
    const inputName = `${targetTypeName}SortParameter`;
    const existingInput = schema.getType(inputName);
    if ((0, index_js_1.isInputObjectType)(existingInput)) {
        fields.push(...Object.values(existingInput.getFields()));
    }
    const sortableTypes = ['ID', 'String', 'Int', 'Float', 'DateTime', 'Money'];
    return new index_js_1.GraphQLInputObjectType({
        name: inputName,
        fields: fields
            .map(field => {
            if (unwrapNonNullType(field.type) === SortOrder) {
                return field;
            }
            else {
                const innerType = unwrapNonNullType(field.type);
                if ((0, index_js_1.isListType)(innerType)) {
                    return;
                }
                return sortableTypes.includes(innerType.name) ? field : undefined;
            }
        })
            .filter(shared_utils_1.notNullOrUndefined)
            .reduce((result, field) => {
            const fieldConfig = {
                type: SortOrder,
            };
            return Object.assign(Object.assign({}, result), { [field.name]: fieldConfig });
        }, {}),
    });
}
function createFilterParameter(schema, targetType) {
    const fields = Object.values(targetType.getFields());
    const targetTypeName = targetType.name;
    const { StringOperators, BooleanOperators, NumberOperators, DateOperators, IDOperators } = getCommonTypes(schema);
    const inputName = `${targetTypeName}FilterParameter`;
    const existingInput = schema.getType(inputName);
    if ((0, index_js_1.isInputObjectType)(existingInput)) {
        fields.push(...Object.values(existingInput.getFields()));
    }
    function getFilterType(field) {
        const innerType = unwrapNonNullType(field.type);
        if ((0, index_js_1.isListType)(innerType)) {
            return;
        }
        if ((0, index_js_1.isEnumType)(innerType)) {
            return StringOperators;
        }
        switch (innerType.name) {
            case 'String':
                return StringOperators;
            case 'Boolean':
                return BooleanOperators;
            case 'Int':
            case 'Float':
            case 'Money':
                return NumberOperators;
            case 'DateTime':
                return DateOperators;
            case 'ID':
                return IDOperators;
            default:
                return;
        }
    }
    const FilterInputType = new index_js_1.GraphQLInputObjectType({
        name: inputName,
        fields: () => {
            const namedFields = fields.reduce((result, field) => {
                const fieldType = field.type;
                const filterType = (0, index_js_1.isInputObjectType)(fieldType) ? fieldType : getFilterType(field);
                if (!filterType) {
                    return result;
                }
                const fieldConfig = {
                    type: filterType,
                };
                return Object.assign(Object.assign({}, result), { [field.name]: fieldConfig });
            }, {});
            return Object.assign(Object.assign({}, namedFields), { _and: { type: new index_js_1.GraphQLList(new index_js_1.GraphQLNonNull(FilterInputType)) }, _or: { type: new index_js_1.GraphQLList(new index_js_1.GraphQLNonNull(FilterInputType)) } });
        },
    });
    return FilterInputType;
}
function getCommonTypes(schema) {
    const SortOrder = schema.getType('SortOrder');
    const StringOperators = schema.getType('StringOperators');
    const BooleanOperators = schema.getType('BooleanOperators');
    const NumberRange = schema.getType('NumberRange');
    const NumberOperators = schema.getType('NumberOperators');
    const DateRange = schema.getType('DateRange');
    const DateOperators = schema.getType('DateOperators');
    const IDOperators = schema.getType('IDOperators');
    if (!SortOrder ||
        !StringOperators ||
        !BooleanOperators ||
        !NumberRange ||
        !NumberOperators ||
        !DateRange ||
        !DateOperators ||
        !IDOperators) {
        throw new Error('A common type was not defined');
    }
    return {
        SortOrder,
        StringOperators,
        BooleanOperators,
        NumberOperators,
        DateOperators,
        IDOperators,
    };
}
/**
 * Unwraps the inner type if it is inside a non-nullable type
 */
function unwrapNonNullType(type) {
    if ((0, index_js_1.isNonNullType)(type)) {
        return type.ofType;
    }
    return type;
}
//# sourceMappingURL=generate-list-options.js.map