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
exports.TranslateErrorResultInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const generated_graphql_admin_errors_1 = require("../../common/error/generated-graphql-admin-errors");
const generated_graphql_shop_errors_1 = require("../../common/error/generated-graphql-shop-errors");
const i18n_service_1 = require("../../i18n/i18n.service");
const parse_context_1 = require("../common/parse-context");
/**
 * @description
 * Translates any top-level ErrorResult message
 */
let TranslateErrorResultInterceptor = class TranslateErrorResultInterceptor {
    constructor(i18nService) {
        this.i18nService = i18nService;
    }
    intercept(context, next) {
        const { isGraphQL, req } = (0, parse_context_1.parseContext)(context);
        return next.handle().pipe((0, operators_1.switchMap)(result => Promise.resolve(result)), (0, operators_1.map)(result => {
            if (Array.isArray(result)) {
                for (const item of result) {
                    this.translateResult(req, item);
                }
            }
            else {
                this.translateResult(req, result);
            }
            return result;
        }));
    }
    translateResult(req, result) {
        if (result instanceof generated_graphql_admin_errors_1.ErrorResult || result instanceof generated_graphql_shop_errors_1.ErrorResult) {
            this.i18nService.translateErrorResult(req, result);
        }
    }
};
exports.TranslateErrorResultInterceptor = TranslateErrorResultInterceptor;
exports.TranslateErrorResultInterceptor = TranslateErrorResultInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [i18n_service_1.I18nService])
], TranslateErrorResultInterceptor);
//# sourceMappingURL=translate-error-result-interceptor.js.map