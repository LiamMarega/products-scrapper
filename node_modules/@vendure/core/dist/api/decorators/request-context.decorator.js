"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ctx = void 0;
const common_1 = require("@nestjs/common");
const is_field_resolver_1 = require("../common/is-field-resolver");
const parse_context_1 = require("../common/parse-context");
const request_context_1 = require("../common/request-context");
/**
 * @description
 * Resolver param decorator which extracts the {@link RequestContext} from the incoming
 * request object.
 *
 * @example
 * ```ts
 *  \@Query()
 *  getAdministrators(\@Ctx() ctx: RequestContext) {
 *      // ...
 *  }
 * ```
 *
 * @docsCategory request
 * @docsPage Ctx Decorator
 */
exports.Ctx = (0, common_1.createParamDecorator)((data, executionContext) => {
    const context = (0, parse_context_1.parseContext)(executionContext);
    const handlerIsFieldResolver = context.isGraphQL && (0, is_field_resolver_1.isFieldResolver)(context.info);
    return (0, request_context_1.internal_getRequestContext)(context.req, handlerIsFieldResolver ? undefined : executionContext);
});
//# sourceMappingURL=request-context.decorator.js.map