import { DeletionResponse, MutationAssignRoleToAdministratorArgs, MutationCreateAdministratorArgs, MutationDeleteAdministratorArgs, MutationDeleteAdministratorsArgs, MutationUpdateActiveAdministratorArgs, MutationUpdateAdministratorArgs, QueryAdministratorArgs, QueryAdministratorsArgs } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { Administrator } from '../../../entity/administrator/administrator.entity';
import { AdministratorService } from '../../../service/services/administrator.service';
import { RequestContext } from '../../common/request-context';
import { RelationPaths } from '../../decorators/relations.decorator';
export declare class AdministratorResolver {
    private administratorService;
    constructor(administratorService: AdministratorService);
    administrators(ctx: RequestContext, args: QueryAdministratorsArgs, relations: RelationPaths<Administrator>): Promise<PaginatedList<Administrator>>;
    administrator(ctx: RequestContext, args: QueryAdministratorArgs, relations: RelationPaths<Administrator>): Promise<Administrator | undefined>;
    activeAdministrator(ctx: RequestContext): Promise<Administrator | undefined>;
    createAdministrator(ctx: RequestContext, args: MutationCreateAdministratorArgs): Promise<Administrator>;
    updateAdministrator(ctx: RequestContext, args: MutationUpdateAdministratorArgs): Promise<Administrator>;
    updateActiveAdministrator(ctx: RequestContext, args: MutationUpdateActiveAdministratorArgs): Promise<Administrator | undefined>;
    assignRoleToAdministrator(ctx: RequestContext, args: MutationAssignRoleToAdministratorArgs): Promise<Administrator>;
    deleteAdministrator(ctx: RequestContext, args: MutationDeleteAdministratorArgs): Promise<DeletionResponse>;
    deleteAdministrators(ctx: RequestContext, args: MutationDeleteAdministratorsArgs): Promise<DeletionResponse[]>;
}
