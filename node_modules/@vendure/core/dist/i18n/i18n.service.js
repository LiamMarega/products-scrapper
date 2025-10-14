"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const i18next_icu_1 = __importDefault(require("i18next-icu"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const config_service_1 = require("../config/config.service");
const i18n_error_1 = require("./i18n-error");
/**
 * This service is responsible for translating messages from the server before they reach the client.
 * The `i18next-express-middleware` middleware detects the client's preferred language based on
 * the `Accept-Language` header or "lang" query param and adds language-specific translation
 * functions to the Express request / response objects.
 *
 * @docsCategory common
 * @docsPage I18nService
 * @docsWeight 0
 */
let I18nService = class I18nService {
    /**
     * @internal
     * @param configService
     */
    constructor(configService) {
        this.configService = configService;
    }
    /**
     * @internal
     */
    onModuleInit() {
        return i18next_1.default
            .use(i18next_http_middleware_1.default.LanguageDetector)
            .use(i18next_fs_backend_1.default)
            .use(i18next_icu_1.default)
            .init({
            nsSeparator: false,
            preload: ['en', 'de', 'ru', 'uk', 'fr'],
            fallbackLng: 'en',
            detection: {
                lookupQuerystring: 'languageCode',
            },
            backend: {
                loadPath: path_1.default.join(__dirname, 'messages/{{lng}}.json'),
                jsonIndent: 2,
            },
        });
    }
    /**
     * @internal
     */
    handle() {
        // Explicit cast due to type mismatch between express v5 (Vendure core)
        // and express v4 (several transitive dependencies)
        return i18next_http_middleware_1.default.handle(i18next_1.default);
    }
    /**
     * @description
     * Add a I18n translation by json file
     *
     * @param langKey language key of the I18n translation file
     * @param filePath path to the I18n translation file
     */
    addTranslationFile(langKey, filePath) {
        try {
            const rawData = fs.readFileSync(filePath);
            const resources = JSON.parse(rawData.toString('utf-8'));
            this.addTranslation(langKey, resources);
        }
        catch (err) {
            config_1.Logger.error(`Could not load resources file ${filePath}`, 'I18nService');
        }
    }
    /**
     * @description
     * Add a I18n translation (key-value) resource
     *
     * @param langKey language key of the I18n translation file
     * @param resources key-value translations
     */
    addTranslation(langKey, resources) {
        i18next_1.default.addResourceBundle(langKey, 'translation', resources, true, true);
    }
    /**
     * Translates the originalError if it is an instance of I18nError.
     * @internal
     */
    translateError(req, error) {
        const originalError = error.originalError;
        const t = req.t;
        if (t && originalError instanceof i18n_error_1.I18nError) {
            let translation = originalError.message;
            try {
                translation = t(originalError.message, originalError.variables);
            }
            catch (e) {
                const message = typeof e.message === 'string' ? e.message : JSON.stringify(e.message);
                translation += ` (Translation format error: ${message})`;
            }
            error.message = translation;
            // We can now safely remove the variables object so that they do not appear in
            // the error returned by the GraphQL API
            delete originalError.variables;
        }
        return error;
    }
    /**
     * Translates the message of an ErrorResult
     * @internal
     */
    translateErrorResult(req, error) {
        const t = req.t;
        let translation = error.message;
        const key = `errorResult.${error.message}`;
        try {
            translation = t(key, error);
        }
        catch (e) {
            const message = typeof e.message === 'string' ? e.message : JSON.stringify(e.message);
            translation += ` (Translation format error: ${message})`;
        }
        error.message = translation;
    }
};
exports.I18nService = I18nService;
exports.I18nService = I18nService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], I18nService);
//# sourceMappingURL=i18n.service.js.map