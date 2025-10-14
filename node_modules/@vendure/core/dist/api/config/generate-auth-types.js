"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthenticationTypes = generateAuthenticationTypes;
const stitch_1 = require("@graphql-tools/stitch");
const graphql_1 = require("graphql");
const errors_1 = require("../../common/error/errors");
/**
 * This function is responsible for constructing the `AuthenticationInput` GraphQL input type.
 * It does so based on the inputs defined by the configured AuthenticationStrategy defineInputType
 * methods, dynamically building a mapped input type of the format:
 *
 *```
 * {
 *     [strategy_name]: strategy_input_type
 * }
 * ```
 */
function generateAuthenticationTypes(schema, authenticationStrategies) {
    const fields = {};
    const strategySchemas = [];
    for (const strategy of authenticationStrategies) {
        const inputSchema = (0, graphql_1.buildASTSchema)(strategy.defineInputType());
        const inputType = Object.values(inputSchema.getTypeMap()).find((type) => (0, graphql_1.isInputObjectType)(type));
        if (!inputType) {
            throw new errors_1.InternalServerError(`${strategy.constructor.name}.defineInputType() does not define a GraphQL Input type`);
        }
        fields[strategy.name] = { type: inputType };
        strategySchemas.push(inputSchema);
    }
    const authenticationInput = new graphql_1.GraphQLInputObjectType({
        name: 'AuthenticationInput',
        fields,
    });
    return (0, stitch_1.stitchSchemas)({
        subschemas: [schema, ...strategySchemas],
        types: [authenticationInput],
        typeMergingOptions: { validationSettings: { validationLevel: stitch_1.ValidationLevel.Off } },
    });
}
//# sourceMappingURL=generate-auth-types.js.map