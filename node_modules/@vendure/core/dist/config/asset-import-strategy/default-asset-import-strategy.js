"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultAssetImportStrategy = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const url_1 = require("url");
const config_service_1 = require("../config.service");
const vendure_logger_1 = require("../logger/vendure-logger");
function fetchUrl(urlString) {
    return new Promise((resolve, reject) => {
        const url = new url_1.URL(urlString);
        const get = url.protocol.startsWith('https') ? https_1.default.get : http_1.default.get;
        get(url, {
            timeout: 5000,
        }, res => {
            const { statusCode } = res;
            if (statusCode !== 200) {
                vendure_logger_1.Logger.error(`Failed to fetch "${urlString.substr(0, 100)}", statusCode: ${statusCode || 'unknown'}`);
                reject(new Error(`Request failed. Status code: ${statusCode || 'unknown'}`));
            }
            else {
                resolve(res);
            }
        });
    });
}
/**
 * @description
 * The DefaultAssetImportStrategy is able to import paths from the local filesystem (taking into account the
 * `importExportOptions.importAssetsDir` setting) as well as remote http/https urls.
 *
 * @since 1.7.0
 * @docsCategory import-export
 */
class DefaultAssetImportStrategy {
    constructor(options) {
        this.options = options;
    }
    init(injector) {
        this.configService = injector.get(config_service_1.ConfigService);
    }
    getStreamFromPath(assetPath) {
        if (/^https?:\/\//.test(assetPath)) {
            return this.getStreamFromUrl(assetPath);
        }
        else {
            return this.getStreamFromLocalFile(assetPath);
        }
    }
    getStreamFromUrl(assetUrl) {
        var _a;
        const { retryCount, retryDelayMs } = (_a = this.options) !== null && _a !== void 0 ? _a : {};
        return (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(fetchUrl(assetUrl)).pipe((0, operators_1.retryWhen)(errors => errors.pipe((0, operators_1.tap)(value => {
            vendure_logger_1.Logger.verbose(value);
            vendure_logger_1.Logger.verbose(`DefaultAssetImportStrategy: retrying fetchUrl for ${assetUrl}`);
        }), (0, operators_1.delay)(retryDelayMs !== null && retryDelayMs !== void 0 ? retryDelayMs : 200), (0, operators_1.take)(retryCount !== null && retryCount !== void 0 ? retryCount : 3)))));
    }
    getStreamFromLocalFile(assetPath) {
        const { importAssetsDir } = this.configService.importExportOptions;
        const filename = path_1.default.join(importAssetsDir, assetPath);
        if (fs_extra_1.default.existsSync(filename)) {
            const fileStat = fs_extra_1.default.statSync(filename);
            if (fileStat.isFile()) {
                try {
                    const stream = fs_extra_1.default.createReadStream(filename);
                    return stream;
                }
                catch (err) {
                    throw err;
                }
            }
            else {
                throw new Error(`Could not find file "${filename}"`);
            }
        }
        else {
            throw new Error(`File "${filename}" does not exist`);
        }
    }
}
exports.DefaultAssetImportStrategy = DefaultAssetImportStrategy;
//# sourceMappingURL=default-asset-import-strategy.js.map