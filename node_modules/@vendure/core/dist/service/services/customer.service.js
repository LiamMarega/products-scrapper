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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const error_result_1 = require("../../common/error/error-result");
const errors_1 = require("../../common/error/errors");
const generated_graphql_admin_errors_1 = require("../../common/error/generated-graphql-admin-errors");
const generated_graphql_shop_errors_1 = require("../../common/error/generated-graphql-shop-errors");
const instrument_decorator_1 = require("../../common/instrument-decorator");
const utils_1 = require("../../common/utils");
const native_authentication_strategy_1 = require("../../config/auth/native-authentication-strategy");
const config_service_1 = require("../../config/config.service");
const transactional_connection_1 = require("../../connection/transactional-connection");
const address_entity_1 = require("../../entity/address/address.entity");
const native_authentication_method_entity_1 = require("../../entity/authentication-method/native-authentication-method.entity");
const channel_entity_1 = require("../../entity/channel/channel.entity");
const customer_entity_1 = require("../../entity/customer/customer.entity");
const user_entity_1 = require("../../entity/user/user.entity");
const event_bus_1 = require("../../event-bus/event-bus");
const account_registration_event_1 = require("../../event-bus/events/account-registration-event");
const account_verified_event_1 = require("../../event-bus/events/account-verified-event");
const customer_address_event_1 = require("../../event-bus/events/customer-address-event");
const customer_event_1 = require("../../event-bus/events/customer-event");
const identifier_change_event_1 = require("../../event-bus/events/identifier-change-event");
const identifier_change_request_event_1 = require("../../event-bus/events/identifier-change-request-event");
const password_reset_event_1 = require("../../event-bus/events/password-reset-event");
const password_reset_verified_event_1 = require("../../event-bus/events/password-reset-verified-event");
const custom_field_relation_service_1 = require("../helpers/custom-field-relation/custom-field-relation.service");
const list_query_builder_1 = require("../helpers/list-query-builder/list-query-builder");
const translator_service_1 = require("../helpers/translator/translator.service");
const address_to_line_1 = require("../helpers/utils/address-to-line");
const patch_entity_1 = require("../helpers/utils/patch-entity");
const channel_service_1 = require("./channel.service");
const country_service_1 = require("./country.service");
const history_service_1 = require("./history.service");
const user_service_1 = require("./user.service");
/**
 * @description
 * Contains methods relating to {@link Customer} entities.
 *
 * @docsCategory services
 */
let CustomerService = class CustomerService {
    constructor(connection, configService, userService, countryService, listQueryBuilder, eventBus, historyService, channelService, customFieldRelationService, translator) {
        this.connection = connection;
        this.configService = configService;
        this.userService = userService;
        this.countryService = countryService;
        this.listQueryBuilder = listQueryBuilder;
        this.eventBus = eventBus;
        this.historyService = historyService;
        this.channelService = channelService;
        this.customFieldRelationService = customFieldRelationService;
        this.translator = translator;
    }
    findAll(ctx, options, relations = []) {
        const customPropertyMap = {};
        const hasPostalCodeFilter = this.listQueryBuilder.filterObjectHasProperty(options === null || options === void 0 ? void 0 : options.filter, 'postalCode');
        if (hasPostalCodeFilter) {
            relations.push('addresses');
            customPropertyMap.postalCode = 'addresses.postalCode';
        }
        return this.listQueryBuilder
            .build(customer_entity_1.Customer, options, {
            relations,
            channelId: ctx.channelId,
            where: { deletedAt: (0, typeorm_1.IsNull)() },
            ctx,
            customPropertyMap,
        })
            .getManyAndCount()
            .then(([items, totalItems]) => ({ items, totalItems }));
    }
    findOne(ctx, id, relations = []) {
        return this.connection
            .findOneInChannel(ctx, customer_entity_1.Customer, id, ctx.channelId, {
            relations,
            where: { deletedAt: (0, typeorm_1.IsNull)() },
        })
            .then(result => result !== null && result !== void 0 ? result : undefined);
    }
    /**
     * @description
     * Returns the Customer entity associated with the given userId, if one exists.
     * Setting `filterOnChannel` to `true` will limit the results to Customers which are assigned
     * to the current active Channel only.
     */
    findOneByUserId(ctx, userId, filterOnChannel = true) {
        let query = this.connection
            .getRepository(ctx, customer_entity_1.Customer)
            .createQueryBuilder('customer')
            .leftJoin('customer.channels', 'channel')
            .leftJoinAndSelect('customer.user', 'user')
            .where('user.id = :userId', { userId })
            .andWhere('customer.deletedAt is null');
        if (filterOnChannel) {
            query = query.andWhere('channel.id = :channelId', { channelId: ctx.channelId });
        }
        return query.getOne().then(result => result !== null && result !== void 0 ? result : undefined);
    }
    /**
     * @description
     * Returns all {@link Address} entities associated with the specified Customer.
     */
    findAddressesByCustomerId(ctx, customerId) {
        return this.connection
            .getRepository(ctx, address_entity_1.Address)
            .createQueryBuilder('address')
            .leftJoinAndSelect('address.country', 'country')
            .leftJoinAndSelect('country.translations', 'countryTranslation')
            .where('address.customer = :id', { id: customerId })
            .getMany()
            .then(addresses => {
            addresses.forEach(address => {
                address.country = this.translator.translate(address.country, ctx);
            });
            return addresses;
        });
    }
    /**
     * @description
     * Returns a list of all {@link CustomerGroup} entities.
     */
    async getCustomerGroups(ctx, customerId) {
        const customerWithGroups = await this.connection.findOneInChannel(ctx, customer_entity_1.Customer, customerId, ctx === null || ctx === void 0 ? void 0 : ctx.channelId, {
            relations: ['groups'],
            where: {
                deletedAt: (0, typeorm_1.IsNull)(),
            },
        });
        if (customerWithGroups) {
            return customerWithGroups.groups;
        }
        else {
            return [];
        }
    }
    /**
     * @description
     * Creates a new Customer, including creation of a new User with the special `customer` Role.
     *
     * If the `password` argument is specified, the Customer will be immediately verified. If not,
     * then an {@link AccountRegistrationEvent} is published, so that the customer can have their
     * email address verified and set their password in a later step using the `verifyCustomerEmailAddress()`
     * method.
     *
     * This method is intended to be used in admin-created Customer flows.
     */
    async create(ctx, input, password) {
        var _a;
        input.emailAddress = (0, utils_1.normalizeEmailAddress)(input.emailAddress);
        const customer = new customer_entity_1.Customer(input);
        const existingCustomerInChannel = await this.connection
            .getRepository(ctx, customer_entity_1.Customer)
            .createQueryBuilder('customer')
            .leftJoin('customer.channels', 'channel')
            .where('channel.id = :channelId', { channelId: ctx.channelId })
            .andWhere('customer.emailAddress = :emailAddress', { emailAddress: input.emailAddress })
            .andWhere('customer.deletedAt is null')
            .getOne();
        if (existingCustomerInChannel) {
            return new generated_graphql_admin_errors_1.EmailAddressConflictError();
        }
        const existingCustomer = await this.connection.getRepository(ctx, customer_entity_1.Customer).findOne({
            relations: ['channels'],
            where: {
                emailAddress: input.emailAddress,
                deletedAt: (0, typeorm_1.IsNull)(),
            },
        });
        const existingUser = await this.userService.getUserByEmailAddress(ctx, input.emailAddress, 'customer');
        if (existingCustomer && existingUser) {
            // Customer already exists, bring to this Channel
            const updatedCustomer = (0, patch_entity_1.patchEntity)(existingCustomer, input);
            updatedCustomer.channels.push(ctx.channel);
            return this.connection.getRepository(ctx, customer_entity_1.Customer).save(updatedCustomer);
        }
        else if (existingCustomer || existingUser) {
            // Not sure when this situation would occur
            return new generated_graphql_admin_errors_1.EmailAddressConflictError();
        }
        const customerUser = await this.userService.createCustomerUser(ctx, input.emailAddress, password);
        if ((0, error_result_1.isGraphQlErrorResult)(customerUser)) {
            throw customerUser;
        }
        customer.user = customerUser;
        if (password && password !== '') {
            const verificationToken = customer.user.getNativeAuthenticationMethod().verificationToken;
            if (verificationToken) {
                const result = await this.userService.verifyUserByToken(ctx, verificationToken);
                if ((0, error_result_1.isGraphQlErrorResult)(result)) {
                    // In theory this should never be reached, so we will just
                    // throw the result
                    throw result;
                }
                else {
                    customer.user = result;
                }
            }
        }
        await this.eventBus.publish(new account_registration_event_1.AccountRegistrationEvent(ctx, customer.user));
        await this.channelService.assignToCurrentChannel(customer, ctx);
        const createdCustomer = await this.connection.getRepository(ctx, customer_entity_1.Customer).save(customer);
        await this.customFieldRelationService.updateRelations(ctx, customer_entity_1.Customer, input, createdCustomer);
        await this.historyService.createHistoryEntryForCustomer({
            ctx,
            customerId: createdCustomer.id,
            type: generated_types_1.HistoryEntryType.CUSTOMER_REGISTERED,
            data: {
                strategy: native_authentication_strategy_1.NATIVE_AUTH_STRATEGY_NAME,
            },
        });
        if ((_a = customer.user) === null || _a === void 0 ? void 0 : _a.verified) {
            await this.historyService.createHistoryEntryForCustomer({
                ctx,
                customerId: createdCustomer.id,
                type: generated_types_1.HistoryEntryType.CUSTOMER_VERIFIED,
                data: {
                    strategy: native_authentication_strategy_1.NATIVE_AUTH_STRATEGY_NAME,
                },
            });
        }
        await this.eventBus.publish(new customer_event_1.CustomerEvent(ctx, createdCustomer, 'created', input));
        return createdCustomer;
    }
    async update(ctx, input) {
        const hasEmailAddress = (i) => Object.hasOwnProperty.call(i, 'emailAddress');
        const customer = await this.connection.getEntityOrThrow(ctx, customer_entity_1.Customer, input.id, {
            channelId: ctx.channelId,
        });
        if (hasEmailAddress(input)) {
            input.emailAddress = (0, utils_1.normalizeEmailAddress)(input.emailAddress);
            if (input.emailAddress !== customer.emailAddress) {
                const existingCustomerInChannel = await this.connection
                    .getRepository(ctx, customer_entity_1.Customer)
                    .createQueryBuilder('customer')
                    .leftJoin('customer.channels', 'channel')
                    .where('channel.id = :channelId', { channelId: ctx.channelId })
                    .andWhere('customer.emailAddress = :emailAddress', {
                    emailAddress: input.emailAddress,
                })
                    .andWhere('customer.id != :customerId', { customerId: input.id })
                    .andWhere('customer.deletedAt is null')
                    .getOne();
                if (existingCustomerInChannel) {
                    return new generated_graphql_admin_errors_1.EmailAddressConflictError();
                }
                if (customer.user) {
                    const existingUserWithEmailAddress = await this.userService.getUserByEmailAddress(ctx, input.emailAddress, 'customer');
                    if (existingUserWithEmailAddress &&
                        !(0, utils_1.idsAreEqual)(customer.user.id, existingUserWithEmailAddress.id)) {
                        return new generated_graphql_admin_errors_1.EmailAddressConflictError();
                    }
                    await this.userService.changeUserAndNativeIdentifier(ctx, customer.user.id, input.emailAddress);
                }
            }
        }
        const updatedCustomer = (0, patch_entity_1.patchEntity)(customer, input);
        await this.connection.getRepository(ctx, customer_entity_1.Customer).save(updatedCustomer, { reload: false });
        await this.customFieldRelationService.updateRelations(ctx, customer_entity_1.Customer, input, updatedCustomer);
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: generated_types_1.HistoryEntryType.CUSTOMER_DETAIL_UPDATED,
            data: {
                input,
            },
        });
        await this.eventBus.publish(new customer_event_1.CustomerEvent(ctx, customer, 'updated', input));
        return (0, utils_1.assertFound)(this.findOne(ctx, customer.id));
    }
    /**
     * @description
     * Registers a new Customer account with the {@link NativeAuthenticationStrategy} and starts
     * the email verification flow (unless {@link AuthOptions} `requireVerification` is set to `false`)
     * by publishing an {@link AccountRegistrationEvent}.
     *
     * This method is intended to be used in storefront Customer-creation flows.
     */
    async registerCustomerAccount(ctx, input) {
        if (!this.configService.authOptions.requireVerification) {
            if (!input.password) {
                return new generated_graphql_shop_errors_1.MissingPasswordError();
            }
        }
        let user = await this.userService.getUserByEmailAddress(ctx, input.emailAddress);
        const hasNativeAuthMethod = !!(user === null || user === void 0 ? void 0 : user.authenticationMethods.find(m => m instanceof native_authentication_method_entity_1.NativeAuthenticationMethod));
        if (user && user.verified) {
            if (hasNativeAuthMethod) {
                // If the user has already been verified and has already
                // registered with the native authentication strategy, do nothing.
                return { success: true };
            }
        }
        const customFields = input.customFields;
        const customer = await this.createOrUpdate(ctx, Object.assign({ emailAddress: input.emailAddress, title: input.title || '', firstName: input.firstName || '', lastName: input.lastName || '', phoneNumber: input.phoneNumber || '' }, (customFields ? { customFields } : {})));
        if ((0, error_result_1.isGraphQlErrorResult)(customer)) {
            return customer;
        }
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: generated_types_1.HistoryEntryType.CUSTOMER_REGISTERED,
            data: {
                strategy: native_authentication_strategy_1.NATIVE_AUTH_STRATEGY_NAME,
            },
        });
        if (!user) {
            const customerUser = await this.userService.createCustomerUser(ctx, input.emailAddress, input.password || undefined);
            if ((0, error_result_1.isGraphQlErrorResult)(customerUser)) {
                return customerUser;
            }
            else {
                user = customerUser;
            }
        }
        if (!hasNativeAuthMethod) {
            const addAuthenticationResult = await this.userService.addNativeAuthenticationMethod(ctx, user, input.emailAddress, input.password || undefined);
            if ((0, error_result_1.isGraphQlErrorResult)(addAuthenticationResult)) {
                return addAuthenticationResult;
            }
            else {
                user = addAuthenticationResult;
            }
        }
        if (!user.verified) {
            user = await this.userService.setVerificationToken(ctx, user);
        }
        customer.user = user;
        await this.connection.getRepository(ctx, user_entity_1.User).save(user, { reload: false });
        await this.connection.getRepository(ctx, customer_entity_1.Customer).save(customer, { reload: false });
        if (!user.verified) {
            await this.eventBus.publish(new account_registration_event_1.AccountRegistrationEvent(ctx, user));
        }
        else {
            await this.historyService.createHistoryEntryForCustomer({
                customerId: customer.id,
                ctx,
                type: generated_types_1.HistoryEntryType.CUSTOMER_VERIFIED,
                data: {
                    strategy: native_authentication_strategy_1.NATIVE_AUTH_STRATEGY_NAME,
                },
            });
        }
        return { success: true };
    }
    /**
     * @description
     * Refreshes a stale email address verification token by generating a new one and
     * publishing a {@link AccountRegistrationEvent}.
     */
    async refreshVerificationToken(ctx, emailAddress) {
        const user = await this.userService.getUserByEmailAddress(ctx, emailAddress);
        if (user && !user.verified) {
            await this.userService.setVerificationToken(ctx, user);
            await this.eventBus.publish(new account_registration_event_1.AccountRegistrationEvent(ctx, user));
        }
    }
    /**
     * @description
     * Given a valid verification token which has been published in an {@link AccountRegistrationEvent}, this
     * method is used to set the Customer as `verified` as part of the account registration flow.
     */
    async verifyCustomerEmailAddress(ctx, verificationToken, password) {
        const result = await this.userService.verifyUserByToken(ctx, verificationToken, password);
        if ((0, error_result_1.isGraphQlErrorResult)(result)) {
            return result;
        }
        const customer = await this.findOneByUserId(ctx, result.id, false);
        if (!customer) {
            throw new errors_1.InternalServerError('error.cannot-locate-customer-for-user');
        }
        if (ctx.channelId) {
            await this.channelService.assignToChannels(ctx, customer_entity_1.Customer, customer.id, [ctx.channelId]);
        }
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: generated_types_1.HistoryEntryType.CUSTOMER_VERIFIED,
            data: {
                strategy: native_authentication_strategy_1.NATIVE_AUTH_STRATEGY_NAME,
            },
        });
        const user = (0, utils_1.assertFound)(this.findOneByUserId(ctx, result.id));
        await this.eventBus.publish(new account_verified_event_1.AccountVerifiedEvent(ctx, customer));
        return user;
    }
    /**
     * @description
     * Publishes a new {@link PasswordResetEvent} for the given email address. This event creates
     * a token which can be used in the `resetPassword()` method.
     */
    async requestPasswordReset(ctx, emailAddress) {
        const user = await this.userService.setPasswordResetToken(ctx, emailAddress);
        if (user) {
            await this.eventBus.publish(new password_reset_event_1.PasswordResetEvent(ctx, user));
            const customer = await this.findOneByUserId(ctx, user.id);
            if (!customer) {
                throw new errors_1.InternalServerError('error.cannot-locate-customer-for-user');
            }
            await this.historyService.createHistoryEntryForCustomer({
                customerId: customer.id,
                ctx,
                type: generated_types_1.HistoryEntryType.CUSTOMER_PASSWORD_RESET_REQUESTED,
                data: {},
            });
        }
    }
    /**
     * @description
     * Given a valid password reset token created by a call to the `requestPasswordReset()` method,
     * this method will change the Customer's password to that given as the `password` argument.
     */
    async resetPassword(ctx, passwordResetToken, password) {
        const result = await this.userService.resetPasswordByToken(ctx, passwordResetToken, password);
        if ((0, error_result_1.isGraphQlErrorResult)(result)) {
            return result;
        }
        const customer = await this.findOneByUserId(ctx, result.id);
        if (!customer) {
            throw new errors_1.InternalServerError('error.cannot-locate-customer-for-user');
        }
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: generated_types_1.HistoryEntryType.CUSTOMER_PASSWORD_RESET_VERIFIED,
            data: {},
        });
        await this.eventBus.publish(new password_reset_verified_event_1.PasswordResetVerifiedEvent(ctx, result));
        return result;
    }
    /**
     * @description
     * Publishes a {@link IdentifierChangeRequestEvent} for the given User. This event contains a token
     * which is then used in the `updateEmailAddress()` method to change the email address of the User &
     * Customer.
     */
    async requestUpdateEmailAddress(ctx, userId, newEmailAddress) {
        const normalizedEmailAddress = (0, utils_1.normalizeEmailAddress)(newEmailAddress);
        const userWithConflictingIdentifier = await this.userService.getUserByEmailAddress(ctx, newEmailAddress);
        if (userWithConflictingIdentifier) {
            return new generated_graphql_shop_errors_1.EmailAddressConflictError();
        }
        const user = await this.userService.getUserById(ctx, userId);
        if (!user) {
            return false;
        }
        const customer = await this.findOneByUserId(ctx, user.id);
        if (!customer) {
            return false;
        }
        const oldEmailAddress = customer.emailAddress;
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: generated_types_1.HistoryEntryType.CUSTOMER_EMAIL_UPDATE_REQUESTED,
            data: {
                oldEmailAddress,
                newEmailAddress: normalizedEmailAddress,
            },
        });
        if (this.configService.authOptions.requireVerification) {
            user.getNativeAuthenticationMethod().pendingIdentifier = normalizedEmailAddress;
            await this.userService.setIdentifierChangeToken(ctx, user);
            await this.eventBus.publish(new identifier_change_request_event_1.IdentifierChangeRequestEvent(ctx, user));
            return true;
        }
        else {
            const oldIdentifier = user.identifier;
            user.identifier = normalizedEmailAddress;
            customer.emailAddress = normalizedEmailAddress;
            await this.connection.getRepository(ctx, user_entity_1.User).save(user, { reload: false });
            await this.connection.getRepository(ctx, customer_entity_1.Customer).save(customer, { reload: false });
            await this.eventBus.publish(new identifier_change_event_1.IdentifierChangeEvent(ctx, user, oldIdentifier));
            await this.historyService.createHistoryEntryForCustomer({
                customerId: customer.id,
                ctx,
                type: generated_types_1.HistoryEntryType.CUSTOMER_EMAIL_UPDATE_VERIFIED,
                data: {
                    oldEmailAddress,
                    newEmailAddress: normalizedEmailAddress,
                },
            });
            return true;
        }
    }
    /**
     * @description
     * Given a valid email update token published in a {@link IdentifierChangeRequestEvent}, this method
     * will update the Customer & User email address.
     */
    async updateEmailAddress(ctx, token) {
        const result = await this.userService.changeIdentifierByToken(ctx, token);
        if ((0, error_result_1.isGraphQlErrorResult)(result)) {
            return result;
        }
        const { user, oldIdentifier } = result;
        if (!user) {
            return false;
        }
        const customer = await this.findOneByUserId(ctx, user.id);
        if (!customer) {
            return false;
        }
        await this.eventBus.publish(new identifier_change_event_1.IdentifierChangeEvent(ctx, user, oldIdentifier));
        customer.emailAddress = user.identifier;
        await this.connection.getRepository(ctx, customer_entity_1.Customer).save(customer, { reload: false });
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: generated_types_1.HistoryEntryType.CUSTOMER_EMAIL_UPDATE_VERIFIED,
            data: {
                oldEmailAddress: oldIdentifier,
                newEmailAddress: customer.emailAddress,
            },
        });
        return true;
    }
    /**
     * @description
     * For guest checkouts, we assume that a matching email address is the same customer.
     */
    async createOrUpdate(ctx, input, errorOnExistingUser = false) {
        input.emailAddress = (0, utils_1.normalizeEmailAddress)(input.emailAddress);
        let customer;
        const existing = await this.connection.getRepository(ctx, customer_entity_1.Customer).findOne({
            relations: ['channels'],
            where: {
                emailAddress: input.emailAddress,
                deletedAt: (0, typeorm_1.IsNull)(),
            },
        });
        if (existing) {
            if (existing.user && errorOnExistingUser) {
                // It is not permitted to modify an existing *registered* Customer
                return new generated_graphql_shop_errors_1.EmailAddressConflictError();
            }
            customer = (0, patch_entity_1.patchEntity)(existing, input);
            customer.channels.push(await this.connection.getEntityOrThrow(ctx, channel_entity_1.Channel, ctx.channelId));
        }
        else {
            customer = await this.connection.getRepository(ctx, customer_entity_1.Customer).save(new customer_entity_1.Customer(input));
            await this.channelService.assignToCurrentChannel(customer, ctx);
            await this.eventBus.publish(new customer_event_1.CustomerEvent(ctx, customer, 'created', input));
        }
        return this.connection.getRepository(ctx, customer_entity_1.Customer).save(customer);
    }
    /**
     * @description
     * Creates a new {@link Address} for the given Customer.
     */
    async createAddress(ctx, customerId, input) {
        const customer = await this.connection.getEntityOrThrow(ctx, customer_entity_1.Customer, customerId, {
            where: { deletedAt: (0, typeorm_1.IsNull)() },
            relations: ['addresses'],
            channelId: ctx.channelId,
        });
        const country = await this.countryService.findOneByCode(ctx, input.countryCode);
        const address = new address_entity_1.Address(Object.assign(Object.assign({}, input), { country }));
        const createdAddress = await this.connection.getRepository(ctx, address_entity_1.Address).save(address);
        await this.customFieldRelationService.updateRelations(ctx, address_entity_1.Address, input, createdAddress);
        customer.addresses.push(createdAddress);
        await this.connection.getRepository(ctx, customer_entity_1.Customer).save(customer, { reload: false });
        await this.enforceSingleDefaultAddress(ctx, createdAddress.id, input);
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: generated_types_1.HistoryEntryType.CUSTOMER_ADDRESS_CREATED,
            data: { address: (0, address_to_line_1.addressToLine)(createdAddress) },
        });
        createdAddress.customer = customer;
        await this.eventBus.publish(new customer_address_event_1.CustomerAddressEvent(ctx, createdAddress, 'created', input));
        return createdAddress;
    }
    async updateAddress(ctx, input) {
        const address = await this.connection.getEntityOrThrow(ctx, address_entity_1.Address, input.id, {
            relations: ['customer', 'country'],
        });
        const customer = await this.connection.findOneInChannel(ctx, customer_entity_1.Customer, address.customer.id, ctx.channelId);
        if (!customer) {
            throw new errors_1.EntityNotFoundError('Address', input.id);
        }
        if (input.countryCode && input.countryCode !== address.country.code) {
            address.country = await this.countryService.findOneByCode(ctx, input.countryCode);
        }
        else {
            address.country = this.translator.translate(address.country, ctx);
        }
        let updatedAddress = (0, patch_entity_1.patchEntity)(address, input);
        updatedAddress = await this.connection.getRepository(ctx, address_entity_1.Address).save(updatedAddress);
        await this.customFieldRelationService.updateRelations(ctx, address_entity_1.Address, input, updatedAddress);
        await this.enforceSingleDefaultAddress(ctx, input.id, input);
        await this.historyService.createHistoryEntryForCustomer({
            customerId: address.customer.id,
            ctx,
            type: generated_types_1.HistoryEntryType.CUSTOMER_ADDRESS_UPDATED,
            data: {
                address: (0, address_to_line_1.addressToLine)(updatedAddress),
                input,
            },
        });
        updatedAddress.customer = customer;
        await this.eventBus.publish(new customer_address_event_1.CustomerAddressEvent(ctx, updatedAddress, 'updated', input));
        return updatedAddress;
    }
    async deleteAddress(ctx, id) {
        const address = await this.connection.getEntityOrThrow(ctx, address_entity_1.Address, id, {
            relations: ['customer', 'country'],
        });
        const customer = await this.connection.findOneInChannel(ctx, customer_entity_1.Customer, address.customer.id, ctx.channelId);
        if (!customer) {
            throw new errors_1.EntityNotFoundError('Address', id);
        }
        address.country = this.translator.translate(address.country, ctx);
        await this.reassignDefaultsForDeletedAddress(ctx, address);
        await this.historyService.createHistoryEntryForCustomer({
            customerId: address.customer.id,
            ctx,
            type: generated_types_1.HistoryEntryType.CUSTOMER_ADDRESS_DELETED,
            data: {
                address: (0, address_to_line_1.addressToLine)(address),
            },
        });
        const deletedAddress = new address_entity_1.Address(address);
        await this.connection.getRepository(ctx, address_entity_1.Address).remove(address);
        address.customer = customer;
        await this.eventBus.publish(new customer_address_event_1.CustomerAddressEvent(ctx, deletedAddress, 'deleted', id));
        return true;
    }
    async softDelete(ctx, customerId) {
        const customer = await this.connection.getEntityOrThrow(ctx, customer_entity_1.Customer, customerId, {
            channelId: ctx.channelId,
        });
        await this.connection
            .getRepository(ctx, customer_entity_1.Customer)
            .update({ id: customerId }, { deletedAt: new Date() });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (customer.user) {
            await this.userService.softDelete(ctx, customer.user.id);
        }
        await this.eventBus.publish(new customer_event_1.CustomerEvent(ctx, customer, 'deleted', customerId));
        return {
            result: generated_types_1.DeletionResult.DELETED,
        };
    }
    /**
     * @description
     * If the Customer associated with the given Order does not yet have any Addresses,
     * this method will create new Address(es) based on the Order's shipping & billing
     * addresses.
     */
    async createAddressesForNewCustomer(ctx, order) {
        var _a;
        if (!order.customer) {
            return;
        }
        const addresses = await this.findAddressesByCustomerId(ctx, order.customer.id);
        // If the Customer has no addresses yet, use the shipping/billing address data
        // to populate the initial default Address.
        if (addresses.length === 0 && ((_a = order.shippingAddress) === null || _a === void 0 ? void 0 : _a.country)) {
            const shippingAddress = order.shippingAddress;
            const billingAddress = order.billingAddress;
            const hasSeparateBillingAddress = (billingAddress === null || billingAddress === void 0 ? void 0 : billingAddress.streetLine1) && !this.addressesAreEqual(shippingAddress, billingAddress);
            if (shippingAddress.streetLine1) {
                await this.createAddress(ctx, order.customer.id, Object.assign(Object.assign({}, shippingAddress), { company: shippingAddress.company || '', streetLine1: shippingAddress.streetLine1 || '', streetLine2: shippingAddress.streetLine2 || '', countryCode: shippingAddress.countryCode || '', defaultBillingAddress: !hasSeparateBillingAddress, defaultShippingAddress: true }));
            }
            if (hasSeparateBillingAddress) {
                await this.createAddress(ctx, order.customer.id, Object.assign(Object.assign({}, billingAddress), { company: billingAddress.company || '', streetLine1: billingAddress.streetLine1 || '', streetLine2: billingAddress.streetLine2 || '', countryCode: billingAddress.countryCode || '', defaultBillingAddress: true, defaultShippingAddress: false }));
            }
        }
    }
    addressesAreEqual(address1, address2) {
        return (address1.streetLine1 === address2.streetLine1 &&
            address1.streetLine2 === address2.streetLine2 &&
            address1.postalCode === address2.postalCode);
    }
    async addNoteToCustomer(ctx, input) {
        const customer = await this.connection.getEntityOrThrow(ctx, customer_entity_1.Customer, input.id, {
            channelId: ctx.channelId,
        });
        await this.historyService.createHistoryEntryForCustomer({
            ctx,
            customerId: customer.id,
            type: generated_types_1.HistoryEntryType.CUSTOMER_NOTE,
            data: {
                note: input.note,
            },
        }, input.isPublic);
        return customer;
    }
    async updateCustomerNote(ctx, input) {
        return this.historyService.updateCustomerHistoryEntry(ctx, {
            type: generated_types_1.HistoryEntryType.CUSTOMER_NOTE,
            data: input.note ? { note: input.note } : undefined,
            ctx,
            entryId: input.noteId,
        });
    }
    async deleteCustomerNote(ctx, id) {
        try {
            await this.historyService.deleteCustomerHistoryEntry(ctx, id);
            return {
                result: generated_types_1.DeletionResult.DELETED,
            };
        }
        catch (e) {
            return {
                result: generated_types_1.DeletionResult.NOT_DELETED,
                message: e.message,
            };
        }
    }
    async enforceSingleDefaultAddress(ctx, addressId, input) {
        const result = await this.connection
            .getRepository(ctx, address_entity_1.Address)
            .findOne({ where: { id: addressId }, relations: ['customer', 'customer.addresses'] });
        if (result) {
            const customerAddressIds = result.customer.addresses
                .map(a => a.id)
                .filter(id => !(0, utils_1.idsAreEqual)(id, addressId));
            if (customerAddressIds.length) {
                if (input.defaultBillingAddress === true) {
                    await this.connection.getRepository(ctx, address_entity_1.Address).update(customerAddressIds, {
                        defaultBillingAddress: false,
                    });
                }
                if (input.defaultShippingAddress === true) {
                    await this.connection.getRepository(ctx, address_entity_1.Address).update(customerAddressIds, {
                        defaultShippingAddress: false,
                    });
                }
            }
        }
    }
    /**
     * If a Customer Address is to be deleted, check if it is assigned as a default for shipping or
     * billing. If so, attempt to transfer default status to one of the other addresses if there are
     * any.
     */
    async reassignDefaultsForDeletedAddress(ctx, addressToDelete) {
        if (!addressToDelete.defaultBillingAddress && !addressToDelete.defaultShippingAddress) {
            return;
        }
        const result = await this.connection
            .getRepository(ctx, address_entity_1.Address)
            .findOne({ where: { id: addressToDelete.id }, relations: ['customer', 'customer.addresses'] });
        if (result) {
            const customerAddresses = result.customer.addresses;
            if (1 < customerAddresses.length) {
                const otherAddresses = customerAddresses
                    .filter(address => !(0, utils_1.idsAreEqual)(address.id, addressToDelete.id))
                    .sort((a, b) => (a.id < b.id ? -1 : 1));
                if (addressToDelete.defaultShippingAddress) {
                    otherAddresses[0].defaultShippingAddress = true;
                }
                if (addressToDelete.defaultBillingAddress) {
                    otherAddresses[0].defaultBillingAddress = true;
                }
                await this.connection.getRepository(ctx, address_entity_1.Address).save(otherAddresses[0], { reload: false });
            }
        }
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    (0, instrument_decorator_1.Instrument)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        config_service_1.ConfigService,
        user_service_1.UserService,
        country_service_1.CountryService,
        list_query_builder_1.ListQueryBuilder,
        event_bus_1.EventBus,
        history_service_1.HistoryService,
        channel_service_1.ChannelService,
        custom_field_relation_service_1.CustomFieldRelationService,
        translator_service_1.TranslatorService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map