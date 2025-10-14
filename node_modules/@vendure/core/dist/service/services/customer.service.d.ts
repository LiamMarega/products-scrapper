import { RegisterCustomerAccountResult, RegisterCustomerInput, UpdateCustomerInput as UpdateCustomerShopInput, VerifyCustomerAccountResult } from '@vendure/common/lib/generated-shop-types';
import { AddNoteToCustomerInput, CreateAddressInput, CreateCustomerInput, CreateCustomerResult, DeletionResponse, UpdateAddressInput, UpdateCustomerInput, UpdateCustomerNoteInput, UpdateCustomerResult } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { ErrorResultUnion } from '../../common/error/error-result';
import { EmailAddressConflictError, IdentifierChangeTokenExpiredError, IdentifierChangeTokenInvalidError, PasswordResetTokenExpiredError, PasswordResetTokenInvalidError, PasswordValidationError } from '../../common/error/generated-graphql-shop-errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Address } from '../../entity/address/address.entity';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { HistoryEntry } from '../../entity/history-entry/history-entry.entity';
import { Order } from '../../entity/order/order.entity';
import { User } from '../../entity/user/user.entity';
import { EventBus } from '../../event-bus/event-bus';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatorService } from '../helpers/translator/translator.service';
import { ChannelService } from './channel.service';
import { CountryService } from './country.service';
import { HistoryService } from './history.service';
import { UserService } from './user.service';
/**
 * @description
 * Contains methods relating to {@link Customer} entities.
 *
 * @docsCategory services
 */
export declare class CustomerService {
    private connection;
    private configService;
    private userService;
    private countryService;
    private listQueryBuilder;
    private eventBus;
    private historyService;
    private channelService;
    private customFieldRelationService;
    private translator;
    constructor(connection: TransactionalConnection, configService: ConfigService, userService: UserService, countryService: CountryService, listQueryBuilder: ListQueryBuilder, eventBus: EventBus, historyService: HistoryService, channelService: ChannelService, customFieldRelationService: CustomFieldRelationService, translator: TranslatorService);
    findAll(ctx: RequestContext, options: ListQueryOptions<Customer> | undefined, relations?: RelationPaths<Customer>): Promise<PaginatedList<Customer>>;
    findOne(ctx: RequestContext, id: ID, relations?: RelationPaths<Customer>): Promise<Customer | undefined>;
    /**
     * @description
     * Returns the Customer entity associated with the given userId, if one exists.
     * Setting `filterOnChannel` to `true` will limit the results to Customers which are assigned
     * to the current active Channel only.
     */
    findOneByUserId(ctx: RequestContext, userId: ID, filterOnChannel?: boolean): Promise<Customer | undefined>;
    /**
     * @description
     * Returns all {@link Address} entities associated with the specified Customer.
     */
    findAddressesByCustomerId(ctx: RequestContext, customerId: ID): Promise<Address[]>;
    /**
     * @description
     * Returns a list of all {@link CustomerGroup} entities.
     */
    getCustomerGroups(ctx: RequestContext, customerId: ID): Promise<CustomerGroup[]>;
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
    create(ctx: RequestContext, input: CreateCustomerInput, password?: string): Promise<ErrorResultUnion<CreateCustomerResult, Customer>>;
    update(ctx: RequestContext, input: UpdateCustomerShopInput & {
        id: ID;
    }): Promise<Customer>;
    update(ctx: RequestContext, input: UpdateCustomerInput): Promise<ErrorResultUnion<UpdateCustomerResult, Customer>>;
    /**
     * @description
     * Registers a new Customer account with the {@link NativeAuthenticationStrategy} and starts
     * the email verification flow (unless {@link AuthOptions} `requireVerification` is set to `false`)
     * by publishing an {@link AccountRegistrationEvent}.
     *
     * This method is intended to be used in storefront Customer-creation flows.
     */
    registerCustomerAccount(ctx: RequestContext, input: RegisterCustomerInput): Promise<RegisterCustomerAccountResult | EmailAddressConflictError | PasswordValidationError>;
    /**
     * @description
     * Refreshes a stale email address verification token by generating a new one and
     * publishing a {@link AccountRegistrationEvent}.
     */
    refreshVerificationToken(ctx: RequestContext, emailAddress: string): Promise<void>;
    /**
     * @description
     * Given a valid verification token which has been published in an {@link AccountRegistrationEvent}, this
     * method is used to set the Customer as `verified` as part of the account registration flow.
     */
    verifyCustomerEmailAddress(ctx: RequestContext, verificationToken: string, password?: string): Promise<ErrorResultUnion<VerifyCustomerAccountResult, Customer>>;
    /**
     * @description
     * Publishes a new {@link PasswordResetEvent} for the given email address. This event creates
     * a token which can be used in the `resetPassword()` method.
     */
    requestPasswordReset(ctx: RequestContext, emailAddress: string): Promise<void>;
    /**
     * @description
     * Given a valid password reset token created by a call to the `requestPasswordReset()` method,
     * this method will change the Customer's password to that given as the `password` argument.
     */
    resetPassword(ctx: RequestContext, passwordResetToken: string, password: string): Promise<User | PasswordResetTokenExpiredError | PasswordResetTokenInvalidError | PasswordValidationError>;
    /**
     * @description
     * Publishes a {@link IdentifierChangeRequestEvent} for the given User. This event contains a token
     * which is then used in the `updateEmailAddress()` method to change the email address of the User &
     * Customer.
     */
    requestUpdateEmailAddress(ctx: RequestContext, userId: ID, newEmailAddress: string): Promise<boolean | EmailAddressConflictError>;
    /**
     * @description
     * Given a valid email update token published in a {@link IdentifierChangeRequestEvent}, this method
     * will update the Customer & User email address.
     */
    updateEmailAddress(ctx: RequestContext, token: string): Promise<boolean | IdentifierChangeTokenInvalidError | IdentifierChangeTokenExpiredError>;
    /**
     * @description
     * For guest checkouts, we assume that a matching email address is the same customer.
     */
    createOrUpdate(ctx: RequestContext, input: Partial<CreateCustomerInput> & {
        emailAddress: string;
    }, errorOnExistingUser?: boolean): Promise<Customer | EmailAddressConflictError>;
    /**
     * @description
     * Creates a new {@link Address} for the given Customer.
     */
    createAddress(ctx: RequestContext, customerId: ID, input: CreateAddressInput): Promise<Address>;
    updateAddress(ctx: RequestContext, input: UpdateAddressInput): Promise<Address>;
    deleteAddress(ctx: RequestContext, id: ID): Promise<boolean>;
    softDelete(ctx: RequestContext, customerId: ID): Promise<DeletionResponse>;
    /**
     * @description
     * If the Customer associated with the given Order does not yet have any Addresses,
     * this method will create new Address(es) based on the Order's shipping & billing
     * addresses.
     */
    createAddressesForNewCustomer(ctx: RequestContext, order: Order): Promise<void>;
    private addressesAreEqual;
    addNoteToCustomer(ctx: RequestContext, input: AddNoteToCustomerInput): Promise<Customer>;
    updateCustomerNote(ctx: RequestContext, input: UpdateCustomerNoteInput): Promise<HistoryEntry>;
    deleteCustomerNote(ctx: RequestContext, id: ID): Promise<DeletionResponse>;
    private enforceSingleDefaultAddress;
    /**
     * If a Customer Address is to be deleted, check if it is assigned as a default for shipping or
     * billing. If so, attempt to transfer default status to one of the other addresses if there are
     * any.
     */
    private reassignDefaultsForDeletedAddress;
}
