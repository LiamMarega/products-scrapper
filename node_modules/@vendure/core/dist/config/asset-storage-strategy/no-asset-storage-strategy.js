"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoAssetStorageStrategy = void 0;
const errors_1 = require("../../common/error/errors");
const errorMessage = 'error.no-asset-storage-strategy-configured';
/**
 * A placeholder strategy which will simply throw an error when used.
 */
class NoAssetStorageStrategy {
    writeFileFromStream(fileName, data) {
        throw new errors_1.InternalServerError(errorMessage);
    }
    writeFileFromBuffer(fileName, data) {
        throw new errors_1.InternalServerError(errorMessage);
    }
    readFileToBuffer(identifier) {
        throw new errors_1.InternalServerError(errorMessage);
    }
    readFileToStream(identifier) {
        throw new errors_1.InternalServerError(errorMessage);
    }
    deleteFile(identifier) {
        throw new errors_1.InternalServerError(errorMessage);
    }
    toAbsoluteUrl(request, identifier) {
        throw new errors_1.InternalServerError(errorMessage);
    }
    fileExists(fileName) {
        throw new errors_1.InternalServerError(errorMessage);
    }
}
exports.NoAssetStorageStrategy = NoAssetStorageStrategy;
//# sourceMappingURL=no-asset-storage-strategy.js.map