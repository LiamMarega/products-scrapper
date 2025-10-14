import { DuplicateEntityResult, MutationDuplicateEntityArgs } from '@vendure/common/lib/generated-types';
import { EntityDuplicatorService } from '../../../service/helpers/entity-duplicator/entity-duplicator.service';
import { RequestContext } from '../../common/request-context';
export declare class DuplicateEntityResolver {
    private entityDuplicatorService;
    constructor(entityDuplicatorService: EntityDuplicatorService);
    entityDuplicators(ctx: RequestContext): Promise<import("@vendure/common/lib/generated-types").EntityDuplicatorDefinition[]>;
    duplicateEntity(ctx: RequestContext, args: MutationDuplicateEntityArgs): Promise<DuplicateEntityResult>;
}
