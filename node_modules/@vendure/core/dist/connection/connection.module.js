"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ConnectionModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionModule = exports.ConnectionCoreModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_module_1 = require("../config/config.module");
const config_service_1 = require("../config/config.service");
const typeorm_logger_1 = require("../config/logger/typeorm-logger");
const custom_fields_validation_subscriber_1 = require("./custom-fields-validation-subscriber");
const transaction_subscriber_1 = require("./transaction-subscriber");
const transaction_wrapper_1 = require("./transaction-wrapper");
const transactional_connection_1 = require("./transactional-connection");
let defaultTypeOrmModule;
let ConnectionCoreModule = class ConnectionCoreModule {
};
exports.ConnectionCoreModule = ConnectionCoreModule;
exports.ConnectionCoreModule = ConnectionCoreModule = __decorate([
    (0, common_1.Module)({
        imports: [config_module_1.ConfigModule],
        providers: [
            transactional_connection_1.TransactionalConnection,
            transaction_subscriber_1.TransactionSubscriber,
            transaction_wrapper_1.TransactionWrapper,
            custom_fields_validation_subscriber_1.CustomFieldsValidationSubscriber,
        ],
        exports: [
            transactional_connection_1.TransactionalConnection,
            transaction_subscriber_1.TransactionSubscriber,
            transaction_wrapper_1.TransactionWrapper,
            custom_fields_validation_subscriber_1.CustomFieldsValidationSubscriber,
        ],
    })
], ConnectionCoreModule);
let ConnectionModule = ConnectionModule_1 = class ConnectionModule {
    static forRoot() {
        if (!defaultTypeOrmModule) {
            defaultTypeOrmModule = typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_module_1.ConfigModule],
                useFactory: (configService) => {
                    const { dbConnectionOptions } = configService;
                    const logger = ConnectionModule_1.getTypeOrmLogger(dbConnectionOptions);
                    return Object.assign(Object.assign({}, dbConnectionOptions), { logger });
                },
                inject: [config_service_1.ConfigService],
            });
        }
        return {
            module: ConnectionModule_1,
            imports: [defaultTypeOrmModule],
        };
    }
    static forPlugin() {
        return {
            module: ConnectionModule_1,
            imports: [typeorm_1.TypeOrmModule.forFeature()],
        };
    }
    static getTypeOrmLogger(dbConnectionOptions) {
        if (!dbConnectionOptions.logger) {
            return new typeorm_logger_1.TypeOrmLogger(dbConnectionOptions.logging);
        }
        else {
            return dbConnectionOptions.logger;
        }
    }
};
exports.ConnectionModule = ConnectionModule;
exports.ConnectionModule = ConnectionModule = ConnectionModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [ConnectionCoreModule],
        exports: [ConnectionCoreModule],
    })
], ConnectionModule);
//# sourceMappingURL=connection.module.js.map