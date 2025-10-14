"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGraphQlErrorResult = isGraphQlErrorResult;
function isGraphQlErrorResult(input) {
    return (input &&
        !!(input.errorCode &&
            input.message != null) &&
        input.__typename);
}
//# sourceMappingURL=error-result.js.map