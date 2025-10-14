"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const vendure_logger_1 = require("../../config/logger/vendure-logger");
const job_1 = require("../../job-queue/job");
/**
 * @description
 * This service allows a concrete search service to override its behaviour
 * by passing itself to the `adopt()` method.
 *
 * @docsCategory services
 */
let SearchService = class SearchService {
    /**
     * @description
     * Adopt a concrete search service implementation to pass through the
     * calls to.
     */
    adopt(override) {
        this.override = override;
    }
    async reindex(ctx) {
        if (this.override) {
            return this.override.reindex(ctx);
        }
        if (!process.env.CI) {
            vendure_logger_1.Logger.warn('The SearchService should be overridden by an appropriate search plugin.');
        }
        return new job_1.Job({
            queueName: 'error',
            data: {},
            id: 'error',
            state: generated_types_1.JobState.FAILED,
            progress: 0,
        });
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)()
], SearchService);
//# sourceMappingURL=search.service.js.map