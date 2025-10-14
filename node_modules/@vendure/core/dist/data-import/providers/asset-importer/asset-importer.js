"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetImporter = void 0;
const common_1 = require("@nestjs/common");
const index_1 = require("../../../common/index");
const config_service_1 = require("../../../config/config.service");
const asset_service_1 = require("../../../service/services/asset.service");
/**
 * @description
 * This service creates new {@link Asset} entities based on string paths provided in the CSV
 * import format. The source files are resolved by joining the value of `importExportOptions.importAssetsDir`
 * with the asset path. This service is used internally by the {@link Importer} service.
 *
 * @docsCategory import-export
 */
let AssetImporter = class AssetImporter {
    /** @internal */
    constructor(configService, assetService) {
        this.configService = configService;
        this.assetService = assetService;
        this.assetMap = new Map();
    }
    /**
     * @description
     * Creates Asset entities for the given paths, using the assetMap cache to prevent the
     * creation of duplicates.
     */
    async getAssets(assetPaths, ctx) {
        const assets = [];
        const errors = [];
        const { assetImportStrategy } = this.configService.importExportOptions;
        const uniqueAssetPaths = new Set(assetPaths);
        for (const assetPath of uniqueAssetPaths.values()) {
            const cachedAsset = this.assetMap.get(assetPath);
            if (cachedAsset) {
                assets.push(cachedAsset);
            }
            else {
                try {
                    const stream = await assetImportStrategy.getStreamFromPath(assetPath);
                    if (stream) {
                        const asset = await this.assetService.createFromFileStream(stream, assetPath, ctx);
                        if ((0, index_1.isGraphQlErrorResult)(asset)) {
                            errors.push(asset.message);
                        }
                        else {
                            this.assetMap.set(assetPath, asset);
                            assets.push(asset);
                        }
                    }
                }
                catch (e) {
                    errors.push(e.message);
                }
            }
        }
        return { assets, errors };
    }
};
exports.AssetImporter = AssetImporter;
exports.AssetImporter = AssetImporter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService, asset_service_1.AssetService])
], AssetImporter);
//# sourceMappingURL=asset-importer.js.map