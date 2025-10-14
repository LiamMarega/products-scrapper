"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoAssetPreviewStrategy = void 0;
const errors_1 = require("../../common/error/errors");
/**
 * A placeholder strategy which will simply throw an error when used.
 */
class NoAssetPreviewStrategy {
    generatePreviewImage(ctx, mimeType, data) {
        throw new errors_1.InternalServerError('error.no-asset-preview-strategy-configured');
    }
}
exports.NoAssetPreviewStrategy = NoAssetPreviewStrategy;
//# sourceMappingURL=no-asset-preview-strategy.js.map