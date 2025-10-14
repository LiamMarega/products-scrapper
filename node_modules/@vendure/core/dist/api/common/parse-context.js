"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseContext = parseContext;
const graphql_1 = require("@nestjs/graphql");
const errors_1 = require("../../common/error/errors");
/**
 * Parses in the Nest ExecutionContext of the incoming request, accounting for both
 * GraphQL & REST requests.
 */
function parseContext(context) {
    var _a, _b, _c;
    // TODO: Remove this check once this issue is resolved: https://github.com/nestjs/graphql/pull/1469
    if (((_c = (_b = (_a = context).getHandler) === null || _b === void 0 ? void 0 : _b.call(_a)) === null || _c === void 0 ? void 0 : _c.name) === '__resolveType') {
        return {
            req: context.getArgs()[1].req,
            res: context.getArgs()[1].res,
            isGraphQL: false,
            info: undefined,
        };
    }
    if (context.getType() === 'http') {
        const httpContext = context.switchToHttp();
        return {
            isGraphQL: false,
            req: httpContext.getRequest(),
            res: httpContext.getResponse(),
            info: undefined,
        };
    }
    else if (context.getType() === 'graphql') {
        const gqlContext = graphql_1.GqlExecutionContext.create(context);
        return {
            isGraphQL: true,
            req: gqlContext.getContext().req,
            res: gqlContext.getContext().res,
            info: gqlContext.getInfo(),
        };
    }
    else {
        throw new errors_1.InternalServerError(`Context "${context.getType()}" is not supported.`);
    }
}
//# sourceMappingURL=parse-context.js.map