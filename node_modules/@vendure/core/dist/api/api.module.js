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
exports.ApiModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_service_1 = require("../config/config.service");
const connection_module_1 = require("../connection/connection.module");
const data_import_module_1 = require("../data-import/data-import.module");
const i18n_module_1 = require("../i18n/i18n.module");
const service_module_1 = require("../service/service.module");
const api_internal_modules_1 = require("./api-internal-modules");
const configure_graphql_module_1 = require("./config/configure-graphql-module");
const constants_1 = require("./constants");
const auth_guard_1 = require("./middleware/auth-guard");
const custom_field_processing_interceptor_1 = require("./middleware/custom-field-processing-interceptor");
const exception_logger_filter_1 = require("./middleware/exception-logger.filter");
const id_interceptor_1 = require("./middleware/id-interceptor");
const translate_error_result_interceptor_1 = require("./middleware/translate-error-result-interceptor");
/**
 * The ApiModule is responsible for the public API of the application. This is where requests
 * come in, are parsed and then handed over to the ServiceModule classes which take care
 * of the business logic.
 */
let ApiModule = class ApiModule {
    constructor(configService) {
        this.configService = configService;
    }
    async configure(consumer) {
        const { adminApiPath, shopApiPath } = this.configService.apiOptions;
        const { uploadMaxFileSize } = this.configService.assetOptions;
        // @ts-ignore
        const { default: graphqlUploadExpress } = await import('graphql-upload/graphqlUploadExpress.mjs');
        consumer
            .apply(graphqlUploadExpress({ maxFileSize: uploadMaxFileSize }))
            .forRoutes(adminApiPath, shopApiPath);
    }
};
exports.ApiModule = ApiModule;
exports.ApiModule = ApiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            service_module_1.ServiceModule,
            connection_module_1.ConnectionModule.forRoot(),
            data_import_module_1.DataImportModule,
            i18n_module_1.I18nModule,
            api_internal_modules_1.ApiSharedModule,
            api_internal_modules_1.AdminApiModule,
            api_internal_modules_1.ShopApiModule,
            (0, configure_graphql_module_1.configureGraphQLModule)(configService => ({
                apiType: 'shop',
                apiPath: configService.apiOptions.shopApiPath,
                playground: configService.apiOptions.shopApiPlayground,
                debug: configService.apiOptions.shopApiDebug,
                typePaths: constants_1.VENDURE_SHOP_API_TYPE_PATHS,
                resolverModule: api_internal_modules_1.ShopApiModule,
                validationRules: configService.apiOptions.shopApiValidationRules,
            })),
            (0, configure_graphql_module_1.configureGraphQLModule)(configService => ({
                apiType: 'admin',
                apiPath: configService.apiOptions.adminApiPath,
                playground: configService.apiOptions.adminApiPlayground,
                debug: configService.apiOptions.adminApiDebug,
                typePaths: constants_1.VENDURE_ADMIN_API_TYPE_PATHS,
                resolverModule: api_internal_modules_1.AdminApiModule,
                validationRules: configService.apiOptions.adminApiValidationRules,
            })),
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: id_interceptor_1.IdInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: custom_field_processing_interceptor_1.CustomFieldProcessingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: translate_error_result_interceptor_1.TranslateErrorResultInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: exception_logger_filter_1.ExceptionLoggerFilter,
            },
        ],
    }),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], ApiModule);
//# sourceMappingURL=api.module.js.map