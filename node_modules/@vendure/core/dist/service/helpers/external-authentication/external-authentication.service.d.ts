import { RequestContext } from '../../../api/common/request-context';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Role } from '../../../entity/role/role.entity';
import { User } from '../../../entity/user/user.entity';
import { AdministratorService } from '../../services/administrator.service';
import { ChannelService } from '../../services/channel.service';
import { CustomerService } from '../../services/customer.service';
import { HistoryService } from '../../services/history.service';
import { RoleService } from '../../services/role.service';
/**
 * @description
 * This is a helper service which exposes methods related to looking up and creating Users based on an
 * external {@link AuthenticationStrategy}.
 *
 * @docsCategory auth
 */
export declare class ExternalAuthenticationService {
    private connection;
    private roleService;
    private historyService;
    private customerService;
    private administratorService;
    private channelService;
    constructor(connection: TransactionalConnection, roleService: RoleService, historyService: HistoryService, customerService: CustomerService, administratorService: AdministratorService, channelService: ChannelService);
    /**
     * @description
     * Looks up a User based on their identifier from an external authentication
     * provider, ensuring this User is associated with a Customer account.
     *
     * By default, only customers in the currently-active Channel will be checked.
     * By passing `false` as the `checkCurrentChannelOnly` argument, _all_ channels
     * will be checked.
     */
    findCustomerUser(ctx: RequestContext, strategy: string, externalIdentifier: string, checkCurrentChannelOnly?: boolean): Promise<User | undefined>;
    /**
     * @description
     * Looks up a User based on their identifier from an external authentication
     * provider, ensuring this User is associated with an Administrator account.
     */
    findAdministratorUser(ctx: RequestContext, strategy: string, externalIdentifier: string): Promise<User | undefined>;
    /**
     * @description
     * If a customer has been successfully authenticated by an external authentication provider, yet cannot
     * be found using `findCustomerUser`, then we need to create a new User and
     * Customer record in Vendure for that user. This method encapsulates that logic as well as additional
     * housekeeping such as adding a record to the Customer's history.
     */
    createCustomerAndUser(ctx: RequestContext, config: {
        strategy: string;
        externalIdentifier: string;
        emailAddress: string;
        firstName: string;
        lastName: string;
        verified?: boolean;
    }): Promise<User>;
    /**
     * @description
     * If an administrator has been successfully authenticated by an external authentication provider, yet cannot
     * be found using `findAdministratorUser`, then we need to create a new User and
     * Administrator record in Vendure for that user.
     */
    createAdministratorAndUser(ctx: RequestContext, config: {
        strategy: string;
        externalIdentifier: string;
        identifier: string;
        emailAddress?: string;
        firstName?: string;
        lastName?: string;
        roles: Role[];
    }): Promise<User>;
    findUser(ctx: RequestContext, strategy: string, externalIdentifier: string): Promise<User | undefined>;
    private findExistingCustomerUserByEmailAddress;
    /**
     * @description
     * Looks up a User based on their identifier from an external authentication
     * provider. Creates the user if does not exist. Unlike `findCustomerUser` and `findAdministratorUser`,
     * this method does not enforce that the User is associated with a Customer or
     * Administrator account.
     *
     */
    createUser(ctx: RequestContext, config: {
        strategy: string;
        externalIdentifier: string;
    }): Promise<User>;
}
