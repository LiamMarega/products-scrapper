"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_INTERFACE_NAME = void 0;
exports.generateErrorCodeEnum = generateErrorCodeEnum;
const graphql_1 = require("graphql");
exports.ERROR_INTERFACE_NAME = 'ErrorResult';
/**
 * Generates the members of the `ErrorCode` enum dynamically, by getting the names of
 * all the types which inherit from the `ErrorResult` interface.
 */
function generateErrorCodeEnum(typeDefsOrSchema) {
    const schema = typeof typeDefsOrSchema === 'string' ? (0, graphql_1.buildSchema)(typeDefsOrSchema) : typeDefsOrSchema;
    const errorNodes = Object.values(schema.getTypeMap())
        .map(type => type.astNode)
        .filter(node => {
        var _a;
        return (node &&
            (node === null || node === void 0 ? void 0 : node.kind) === 'ObjectTypeDefinition' &&
            ((_a = node.interfaces) === null || _a === void 0 ? void 0 : _a.map(i => i.name.value).includes(exports.ERROR_INTERFACE_NAME)));
    });
    if (!errorNodes.length) {
        return schema;
    }
    const errorCodeEnum = `
        extend enum ErrorCode {
            ${errorNodes.map(n => camelToUpperSnakeCase((n === null || n === void 0 ? void 0 : n.name.value) || '')).join('\n')}
        }`;
    return (0, graphql_1.extendSchema)(schema, (0, graphql_1.parse)(errorCodeEnum));
}
function camelToUpperSnakeCase(input) {
    return input.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}
//# sourceMappingURL=generate-error-code-enum.js.map