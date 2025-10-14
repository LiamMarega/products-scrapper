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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const cookie_session_1 = __importDefault(require("cookie-session"));
const api_module_1 = require("./api/api.module");
const config_module_1 = require("./config/config.module");
const config_service_1 = require("./config/config.service");
const vendure_logger_1 = require("./config/logger/vendure-logger");
const connection_module_1 = require("./connection/connection.module");
const health_check_module_1 = require("./health-check/health-check.module");
const i18n_module_1 = require("./i18n/i18n.module");
const i18n_service_1 = require("./i18n/i18n.service");
const plugin_module_1 = require("./plugin/plugin.module");
const process_context_module_1 = require("./process-context/process-context.module");
const service_module_1 = require("./service/service.module");
let AppModule = class AppModule {
    constructor(configService, i18nService) {
        this.configService = configService;
        this.i18nService = i18nService;
    }
    configure(consumer) {
        const { adminApiPath, shopApiPath, middleware } = this.configService.apiOptions;
        const { cookieOptions } = this.configService.authOptions;
        const i18nextHandler = this.i18nService.handle();
        const defaultMiddleware = [
            { handler: i18nextHandler, route: adminApiPath },
            { handler: i18nextHandler, route: shopApiPath },
        ];
        const allMiddleware = defaultMiddleware.concat(middleware);
        // If the Admin API and Shop API should have specific cookies names, we need to create separate cookie sessions
        if (typeof (cookieOptions === null || cookieOptions === void 0 ? void 0 : cookieOptions.name) === 'object') {
            const shopApiCookieName = cookieOptions.name.shop;
            const adminApiCookieName = cookieOptions.name.admin;
            allMiddleware.push({
                handler: (0, cookie_session_1.default)(Object.assign(Object.assign({}, cookieOptions), { name: adminApiCookieName })),
                route: adminApiPath,
            });
            allMiddleware.push({
                handler: (0, cookie_session_1.default)(Object.assign(Object.assign({}, cookieOptions), { name: shopApiCookieName })),
                route: shopApiPath,
            });
        }
        const consumableMiddlewares = allMiddleware.filter(mid => !mid.beforeListen);
        const middlewareByRoute = this.groupMiddlewareByRoute(consumableMiddlewares);
        for (const [route, handlers] of Object.entries(middlewareByRoute)) {
            consumer.apply(...handlers).forRoutes(route);
        }
    }
    async onApplicationShutdown(signal) {
        if (signal) {
            vendure_logger_1.Logger.info('Received shutdown signal:' + signal);
        }
    }
    /**
     * Groups middleware handler together in an object with the route as the key.
     */
    groupMiddlewareByRoute(middlewareArray) {
        const result = {};
        for (const middleware of middlewareArray) {
            const route = middleware.route || this.configService.apiOptions.adminApiPath;
            if (!result[route]) {
                result[route] = [];
            }
            result[route].push(middleware.handler);
        }
        return result;
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            process_context_module_1.ProcessContextModule,
            config_module_1.ConfigModule,
            i18n_module_1.I18nModule,
            api_module_1.ApiModule,
            plugin_module_1.PluginModule.forRoot(),
            health_check_module_1.HealthCheckModule,
            service_module_1.ServiceModule,
            connection_module_1.ConnectionModule,
        ],
    }),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        i18n_service_1.I18nService])
], AppModule);
//# sourceMappingURL=app.module.js.map