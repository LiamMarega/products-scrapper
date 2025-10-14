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
exports.EntityDuplicatorService = void 0;
const common_1 = require("@nestjs/common");
const generated_graphql_admin_errors_1 = require("../../../common/error/generated-graphql-admin-errors");
const config_service_1 = require("../../../config/config.service");
const vendure_logger_1 = require("../../../config/logger/vendure-logger");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const config_arg_service_1 = require("../config-arg/config-arg.service");
/**
 * @description
 * This service is used to duplicate entities using one of the configured
 * {@link EntityDuplicator} functions.
 *
 * @docsCategory service-helpers
 * @since 2.2.0
 */
let EntityDuplicatorService = class EntityDuplicatorService {
    constructor(configService, configArgService, connection) {
        this.configService = configService;
        this.configArgService = configArgService;
        this.connection = connection;
    }
    /**
     * @description
     * Returns all configured {@link EntityDuplicator} definitions.
     */
    getEntityDuplicators(ctx) {
        return this.configArgService.getDefinitions('EntityDuplicator').map(x => (Object.assign(Object.assign({}, x.toGraphQlType(ctx)), { __typename: 'EntityDuplicatorDefinition', forEntities: x.forEntities, requiresPermission: x.requiresPermission })));
    }
    /**
     * @description
     * Duplicates an entity using the specified {@link EntityDuplicator}. The duplication is performed
     * within a transaction, so if an error occurs, the transaction will be rolled back.
     */
    async duplicateEntity(ctx, input) {
        const duplicator = this.configService.entityOptions.entityDuplicators.find(s => s.forEntities.includes(input.entityName) && s.code === input.duplicatorInput.code);
        if (!duplicator) {
            return new generated_graphql_admin_errors_1.DuplicateEntityError({
                duplicationError: ctx.translate(`message.entity-duplication-no-strategy-found`, {
                    entityName: input.entityName,
                    code: input.duplicatorInput.code,
                }),
            });
        }
        // Check permissions
        if (duplicator.requiresPermission.length === 0 ||
            !ctx.userHasPermissions(duplicator.requiresPermission)) {
            return new generated_graphql_admin_errors_1.DuplicateEntityError({
                duplicationError: ctx.translate(`message.entity-duplication-no-permission`),
            });
        }
        const parsedInput = this.configArgService.parseInput('EntityDuplicator', input.duplicatorInput);
        return await this.connection.withTransaction(ctx, async (innerCtx) => {
            var _a;
            try {
                const newEntity = await duplicator.duplicate({
                    ctx: innerCtx,
                    entityName: input.entityName,
                    id: input.entityId,
                    args: parsedInput.args,
                });
                return { newEntityId: newEntity.id };
            }
            catch (e) {
                await this.connection.rollBackTransaction(innerCtx);
                vendure_logger_1.Logger.error(e.message, undefined, e.stack);
                return new generated_graphql_admin_errors_1.DuplicateEntityError({
                    duplicationError: (_a = e.message) !== null && _a !== void 0 ? _a : e.toString(),
                });
            }
        });
    }
};
exports.EntityDuplicatorService = EntityDuplicatorService;
exports.EntityDuplicatorService = EntityDuplicatorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        config_arg_service_1.ConfigArgService,
        transactional_connection_1.TransactionalConnection])
], EntityDuplicatorService);
//# sourceMappingURL=entity-duplicator.service.js.map