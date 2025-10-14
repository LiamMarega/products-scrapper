import { DeletionResponse, MutationCreateRoleArgs, MutationDeleteRoleArgs, MutationDeleteRolesArgs, MutationUpdateRoleArgs, QueryRoleArgs, QueryRolesArgs } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { Role } from '../../../entity/role/role.entity';
import { RoleService } from '../../../service/services/role.service';
import { RequestContext } from '../../common/request-context';
import { RelationPaths } from '../../decorators/relations.decorator';
export declare class RoleResolver {
    private roleService;
    constructor(roleService: RoleService);
    roles(ctx: RequestContext, args: QueryRolesArgs, relations: RelationPaths<Role>): Promise<PaginatedList<Role>>;
    role(ctx: RequestContext, args: QueryRoleArgs, relations: RelationPaths<Role>): Promise<Role | undefined>;
    createRole(ctx: RequestContext, args: MutationCreateRoleArgs): Promise<Role>;
    updateRole(ctx: RequestContext, args: MutationUpdateRoleArgs): Promise<Role>;
    deleteRole(ctx: RequestContext, args: MutationDeleteRoleArgs): Promise<DeletionResponse>;
    deleteRoles(ctx: RequestContext, args: MutationDeleteRolesArgs): Promise<DeletionResponse[]>;
}
