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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const omit_1 = require("@vendure/common/lib/omit");
const pick_1 = require("@vendure/common/lib/pick");
const job_1 = require("../../../job-queue/job");
let JobEntityResolver = class JobEntityResolver {
    constructor() {
        this.graphQlMaxInt = 2 ** 31 - 1;
    }
    async duration(job) {
        return Math.min(job.duration, this.graphQlMaxInt);
    }
    async data(job) {
        const ctx = job.data.ctx;
        if (this.isSerializedRequestContext(ctx)) {
            // The job data includes a serialized RequestContext object
            // This can be very large, so we will manually prune it before
            // returning
            const prunedCtx = Object.assign(Object.assign({}, (0, pick_1.pick)(ctx, [
                '_apiType',
                '_languageCode',
                '_authorizedAsOwnerOnly',
                '_isAuthorized',
                '_channel',
            ])), { _session: ctx._session
                    ? Object.assign(Object.assign({}, ctx._session), { user: ctx._session.user ? (0, omit_1.omit)(ctx._session.user, ['channelPermissions']) : {} }) : {} });
            job.data.ctx = prunedCtx;
        }
        return job.data;
    }
    isSerializedRequestContext(input) {
        if (typeof input !== 'object' || input == null) {
            return false;
        }
        return (typeof input === 'object' &&
            input.hasOwnProperty('_apiType') &&
            input.hasOwnProperty('_channel') &&
            input.hasOwnProperty('_languageCode'));
    }
};
exports.JobEntityResolver = JobEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_1.Job]),
    __metadata("design:returntype", Promise)
], JobEntityResolver.prototype, "duration", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_1.Job]),
    __metadata("design:returntype", Promise)
], JobEntityResolver.prototype, "data", null);
exports.JobEntityResolver = JobEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Job')
], JobEntityResolver);
//# sourceMappingURL=job-entity.resolver.js.map