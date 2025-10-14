import { CreateTaxRateInput, DeletionResponse, UpdateTaxRateInput } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { ListQueryOptions } from '../../common/types/common-types';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { TaxCategory } from '../../entity/tax-category/tax-category.entity';
import { TaxRate } from '../../entity/tax-rate/tax-rate.entity';
import { Zone } from '../../entity/zone/zone.entity';
import { EventBus } from '../../event-bus/event-bus';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
/**
 * @description
 * Contains methods relating to {@link TaxRate} entities.
 *
 * @docsCategory services
 */
export declare class TaxRateService {
    private connection;
    private eventBus;
    private listQueryBuilder;
    private configService;
    private customFieldRelationService;
    private readonly defaultTaxRate;
    private activeTaxRates;
    constructor(connection: TransactionalConnection, eventBus: EventBus, listQueryBuilder: ListQueryBuilder, configService: ConfigService, customFieldRelationService: CustomFieldRelationService);
    /**
     * When the app is bootstrapped, ensure the tax rate cache gets created
     * @internal
     */
    initTaxRates(): Promise<void>;
    findAll(ctx: RequestContext, options?: ListQueryOptions<TaxRate>, relations?: RelationPaths<TaxRate>): Promise<PaginatedList<TaxRate>>;
    findOne(ctx: RequestContext, taxRateId: ID, relations?: RelationPaths<TaxRate>): Promise<TaxRate | undefined>;
    create(ctx: RequestContext, input: CreateTaxRateInput): Promise<TaxRate>;
    update(ctx: RequestContext, input: UpdateTaxRateInput): Promise<TaxRate>;
    delete(ctx: RequestContext, id: ID): Promise<DeletionResponse>;
    /**
     * @description
     * Returns the applicable TaxRate based on the specified Zone and TaxCategory. Used when calculating Order
     * prices.
     */
    getApplicableTaxRate(ctx: RequestContext, zone: Zone | ID, taxCategory: TaxCategory | ID): Promise<TaxRate>;
    private getActiveTaxRates;
    private updateActiveTaxRates;
    private findActiveTaxRates;
    /**
     * Ensures taxRate cache exists. If not, this method creates one.
     */
    private ensureCacheExists;
}
