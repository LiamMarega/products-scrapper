import { DeepPartial } from '@vendure/common/lib/shared-types';
import { SoftDeletable } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { AuthenticationMethod } from '../authentication-method/authentication-method.entity';
import { NativeAuthenticationMethod } from '../authentication-method/native-authentication-method.entity';
import { VendureEntity } from '../base/base.entity';
import { CustomUserFields } from '../custom-entity-fields';
import { Role } from '../role/role.entity';
import { AuthenticatedSession } from '../session/authenticated-session.entity';
/**
 * @description
 * A User represents any authenticated user of the Vendure API. This includes both
 * {@link Administrator}s as well as registered {@link Customer}s.
 *
 * @docsCategory entities
 */
export declare class User extends VendureEntity implements HasCustomFields, SoftDeletable {
    constructor(input?: DeepPartial<User>);
    deletedAt: Date | null;
    identifier: string;
    authenticationMethods: AuthenticationMethod[];
    verified: boolean;
    roles: Role[];
    lastLogin: Date | null;
    customFields: CustomUserFields;
    sessions: AuthenticatedSession[];
    getNativeAuthenticationMethod(): NativeAuthenticationMethod;
    getNativeAuthenticationMethod(strict?: boolean): NativeAuthenticationMethod | undefined;
}
