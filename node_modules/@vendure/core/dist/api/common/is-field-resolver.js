"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFieldResolver = isFieldResolver;
/**
 * Returns true is this guard is being called on a FieldResolver, i.e. not a top-level
 * Query or Mutation resolver.
 */
function isFieldResolver(info) {
    var _a;
    if (!info) {
        return false;
    }
    const parentType = (_a = info === null || info === void 0 ? void 0 : info.parentType) === null || _a === void 0 ? void 0 : _a.name;
    return parentType !== 'Query' && parentType !== 'Mutation' && parentType !== 'Subscription';
}
//# sourceMappingURL=is-field-resolver.js.map