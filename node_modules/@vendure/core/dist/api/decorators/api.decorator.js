"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const common_1 = require("@nestjs/common");
const get_api_type_1 = require("../common/get-api-type");
/**
 * @description
 * Resolver param decorator which returns which Api the request came though.
 * This is useful because sometimes the same resolver will have different behaviour
 * depending whether it is being called from the shop API or the admin API.
 *
 * Returns a string of type {@link ApiType}.
 *
 * @example
 * ```ts
 *  \@Query()
 *  getAdministrators(\@Api() apiType: ApiType) {
 *    if (apiType === 'admin') {
 *      // ...
 *    }
 *  }
 * ```
 * @docsCategory request
 * @docsPage Api Decorator
 */
exports.Api = (0, common_1.createParamDecorator)((data, ctx) => {
    const info = ctx.getArgByIndex(3);
    return (0, get_api_type_1.getApiType)(info);
});
//# sourceMappingURL=api.decorator.js.map