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
exports.ExternalAuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const administrator_entity_1 = require("../../../entity/administrator/administrator.entity");
const external_authentication_method_entity_1 = require("../../../entity/authentication-method/external-authentication-method.entity");
const customer_entity_1 = require("../../../entity/customer/customer.entity");
const user_entity_1 = require("../../../entity/user/user.entity");
const administrator_service_1 = require("../../services/administrator.service");
const channel_service_1 = require("../../services/channel.service");
const customer_service_1 = require("../../services/customer.service");
const history_service_1 = require("../../services/history.service");
const role_service_1 = require("../../services/role.service");
/**
 * @description
 * This is a helper service which exposes methods related to looking up and creating Users based on an
 * external {@link AuthenticationStrategy}.
 *
 * @docsCategory auth
 */
let ExternalAuthenticationService = class ExternalAuthenticationService {
    constructor(connection, roleService, historyService, customerService, administratorService, channelService) {
        this.connection = connection;
        this.roleService = roleService;
        this.historyService = historyService;
        this.customerService = customerService;
        this.administratorService = administratorService;
        this.channelService = channelService;
    }
    /**
     * @description
     * Looks up a User based on their identifier from an external authentication
     * provider, ensuring this User is associated with a Customer account.
     *
     * By default, only customers in the currently-active Channel will be checked.
     * By passing `false` as the `checkCurrentChannelOnly` argument, _all_ channels
     * will be checked.
     */
    async findCustomerUser(ctx, strategy, externalIdentifier, checkCurrentChannelOnly = true) {
        const user = await this.findUser(ctx, strategy, externalIdentifier);
        if (user) {
            // Ensure this User is associated with a Customer
            const customer = await this.customerService.findOneByUserId(ctx, user.id, checkCurrentChannelOnly);
            if (customer) {
                return user;
            }
        }
    }
    /**
     * @description
     * Looks up a User based on their identifier from an external authentication
     * provider, ensuring this User is associated with an Administrator account.
     */
    async findAdministratorUser(ctx, strategy, externalIdentifier) {
        const user = await this.findUser(ctx, strategy, externalIdentifier);
        if (user) {
            // Ensure this User is associated with an Administrator
            const administrator = await this.administratorService.findOneByUserId(ctx, user.id);
            if (administrator) {
                return user;
            }
        }
    }
    /**
     * @description
     * If a customer has been successfully authenticated by an external authentication provider, yet cannot
     * be found using `findCustomerUser`, then we need to create a new User and
     * Customer record in Vendure for that user. This method encapsulates that logic as well as additional
     * housekeeping such as adding a record to the Customer's history.
     */
    async createCustomerAndUser(ctx, config) {
        let user;
        const existingUser = await this.findExistingCustomerUserByEmailAddress(ctx, config.emailAddress);
        if (existingUser) {
            user = existingUser;
        }
        else {
            const customerRole = await this.roleService.getCustomerRole(ctx);
            user = new user_entity_1.User({
                identifier: config.emailAddress,
                roles: [customerRole],
                verified: config.verified || false,
                authenticationMethods: [],
            });
        }
        const authMethod = await this.connection.getRepository(ctx, external_authentication_method_entity_1.ExternalAuthenticationMethod).save(new external_authentication_method_entity_1.ExternalAuthenticationMethod({
            externalIdentifier: config.externalIdentifier,
            strategy: config.strategy,
        }));
        user.authenticationMethods = [...(user.authenticationMethods || []), authMethod];
        const savedUser = await this.connection.getRepository(ctx, user_entity_1.User).save(user);
        let customer;
        const existingCustomer = await this.customerService.findOneByUserId(ctx, savedUser.id);
        if (existingCustomer) {
            customer = existingCustomer;
        }
        else {
            customer = new customer_entity_1.Customer({
                emailAddress: config.emailAddress,
                firstName: config.firstName,
                lastName: config.lastName,
                user: savedUser,
            });
        }
        await this.channelService.assignToCurrentChannel(customer, ctx);
        await this.connection.getRepository(ctx, customer_entity_1.Customer).save(customer);
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: generated_types_1.HistoryEntryType.CUSTOMER_REGISTERED,
            data: {
                strategy: config.strategy,
            },
        });
        if (config.verified) {
            await this.historyService.createHistoryEntryForCustomer({
                customerId: customer.id,
                ctx,
                type: generated_types_1.HistoryEntryType.CUSTOMER_VERIFIED,
                data: {
                    strategy: config.strategy,
                },
            });
        }
        return savedUser;
    }
    /**
     * @description
     * If an administrator has been successfully authenticated by an external authentication provider, yet cannot
     * be found using `findAdministratorUser`, then we need to create a new User and
     * Administrator record in Vendure for that user.
     */
    async createAdministratorAndUser(ctx, config) {
        const newUser = new user_entity_1.User({
            identifier: config.identifier,
            roles: config.roles,
            verified: true,
        });
        const authMethod = await this.connection.getRepository(ctx, external_authentication_method_entity_1.ExternalAuthenticationMethod).save(new external_authentication_method_entity_1.ExternalAuthenticationMethod({
            externalIdentifier: config.externalIdentifier,
            strategy: config.strategy,
        }));
        newUser.authenticationMethods = [authMethod];
        const savedUser = await this.connection.getRepository(ctx, user_entity_1.User).save(newUser);
        const administrator = await this.connection.getRepository(ctx, administrator_entity_1.Administrator).save(new administrator_entity_1.Administrator({
            emailAddress: config.emailAddress,
            firstName: config.firstName,
            lastName: config.lastName,
            user: savedUser,
        }));
        return savedUser;
    }
    async findUser(ctx, strategy, externalIdentifier) {
        const user = await this.connection
            .getRepository(ctx, user_entity_1.User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.authenticationMethods', 'aums')
            .leftJoin('user.authenticationMethods', 'authMethod')
            .andWhere('authMethod.externalIdentifier = :externalIdentifier', { externalIdentifier })
            .andWhere('authMethod.strategy = :strategy', { strategy })
            .andWhere('user.deletedAt IS NULL')
            .getOne();
        return user || undefined;
    }
    async findExistingCustomerUserByEmailAddress(ctx, emailAddress) {
        const customer = await this.connection
            .getRepository(ctx, customer_entity_1.Customer)
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user')
            .leftJoin('customer.channels', 'channel')
            .leftJoinAndSelect('user.authenticationMethods', 'authMethod')
            .andWhere('customer.emailAddress = :emailAddress', { emailAddress })
            .andWhere('user.deletedAt IS NULL')
            .getOne();
        return customer === null || customer === void 0 ? void 0 : customer.user;
    }
    /**
     * @description
     * Looks up a User based on their identifier from an external authentication
     * provider. Creates the user if does not exist. Unlike `findCustomerUser` and `findAdministratorUser`,
     * this method does not enforce that the User is associated with a Customer or
     * Administrator account.
     *
     */
    async createUser(ctx, config) {
        const user = await this.findUser(ctx, config.strategy, config.externalIdentifier);
        if (user) {
            return user;
        }
        const newUser = new user_entity_1.User();
        const authMethod = await this.connection.getRepository(ctx, external_authentication_method_entity_1.ExternalAuthenticationMethod).save(new external_authentication_method_entity_1.ExternalAuthenticationMethod({
            externalIdentifier: config.externalIdentifier,
            strategy: config.strategy,
        }));
        newUser.identifier = config.externalIdentifier;
        newUser.authenticationMethods = [authMethod];
        const savedUser = await this.connection.getRepository(ctx, user_entity_1.User).save(newUser);
        return savedUser;
    }
};
exports.ExternalAuthenticationService = ExternalAuthenticationService;
exports.ExternalAuthenticationService = ExternalAuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        role_service_1.RoleService,
        history_service_1.HistoryService,
        customer_service_1.CustomerService,
        administrator_service_1.AdministratorService,
        channel_service_1.ChannelService])
], ExternalAuthenticationService);
//# sourceMappingURL=external-authentication.service.js.map