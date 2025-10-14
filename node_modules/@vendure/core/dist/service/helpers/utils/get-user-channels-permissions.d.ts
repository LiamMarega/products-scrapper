import { Permission } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Role } from '../../../entity/role/role.entity';
import { User } from '../../../entity/user/user.entity';
export interface UserChannelPermissions {
    id: ID;
    token: string;
    code: string;
    permissions: Permission[];
}
/**
 * Returns an array of Channels and permissions on those Channels for the given User.
 */
export declare function getUserChannelsPermissions(user: User): UserChannelPermissions[];
/**
 * @description
 * Returns an array of Channels and permissions on those Channels for the given Roles.
 */
export declare function getChannelPermissions(roles: Role[]): UserChannelPermissions[];
