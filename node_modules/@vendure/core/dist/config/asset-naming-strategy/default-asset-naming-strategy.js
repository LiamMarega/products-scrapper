"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultAssetNamingStrategy = void 0;
const normalize_string_1 = require("@vendure/common/lib/normalize-string");
const path_1 = __importDefault(require("path"));
/**
 * @description
 * The default strategy normalizes the file names to remove unwanted characters and
 * in the case of conflicts, increments a counter suffix.
 *
 * @docsCategory assets
 */
class DefaultAssetNamingStrategy {
    constructor() {
        this.numberingRe = /__(\d+)(\.[^.]+)?$/;
    }
    generateSourceFileName(ctx, originalFileName, conflictFileName) {
        const normalized = (0, normalize_string_1.normalizeString)(originalFileName, '-');
        if (!conflictFileName) {
            return normalized;
        }
        else {
            return this.incrementOrdinalSuffix(normalized, conflictFileName);
        }
    }
    generatePreviewFileName(ctx, sourceFileName, conflictFileName) {
        const previewSuffix = '__preview';
        const previewFileName = this.isSupportedImageFormat(sourceFileName)
            ? this.addSuffix(sourceFileName, previewSuffix)
            : this.addSuffix(sourceFileName, previewSuffix) + '.png';
        if (!conflictFileName) {
            return previewFileName;
        }
        else {
            return this.incrementOrdinalSuffix(previewFileName, conflictFileName);
        }
    }
    /**
     * A "supported format" means that the Sharp library can transform it and output the same
     * file type. Unsupported images and other non-image files will be converted to png.
     *
     * See http://sharp.pixelplumbing.com/en/stable/api-output/#tobuffer
     */
    isSupportedImageFormat(fileName) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.avif', '.gif'];
        const ext = path_1.default.extname(fileName);
        return imageExtensions.includes(ext);
    }
    incrementOrdinalSuffix(baseFileName, conflictFileName) {
        const matches = conflictFileName.match(this.numberingRe);
        const ord = Number(matches && matches[1]) || 1;
        return this.addOrdinalSuffix(baseFileName, ord + 1);
    }
    addOrdinalSuffix(fileName, order) {
        const paddedOrder = order.toString(10).padStart(2, '0');
        return this.addSuffix(fileName, `__${paddedOrder}`);
    }
    addSuffix(fileName, suffix) {
        const ext = path_1.default.extname(fileName);
        const baseName = path_1.default.basename(fileName, ext);
        return `${baseName}${suffix}${ext}`;
    }
}
exports.DefaultAssetNamingStrategy = DefaultAssetNamingStrategy;
//# sourceMappingURL=default-asset-naming-strategy.js.map