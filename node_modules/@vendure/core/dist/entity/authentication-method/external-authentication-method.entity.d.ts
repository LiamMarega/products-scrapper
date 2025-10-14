import { DeepPartial } from '@vendure/common/lib/shared-types';
import { AuthenticationMethod } from './authentication-method.entity';
/**
 * @description
 * This method is used when an external authentication service is used to authenticate Vendure Users.
 * Examples of external auth include social logins or corporate identity servers.
 *
 * @docsCategory entities
 * @docsPage AuthenticationMethod
 */
export declare class ExternalAuthenticationMethod extends AuthenticationMethod {
    constructor(input: DeepPartial<ExternalAuthenticationMethod>);
    strategy: string;
    externalIdentifier: string;
    metadata: any;
}
