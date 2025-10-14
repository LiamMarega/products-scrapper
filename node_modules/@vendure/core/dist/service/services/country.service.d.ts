import { CreateCountryInput, DeletionResponse, UpdateCountryInput } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Country } from '../../entity/region/country.entity';
import { EventBus } from '../../event-bus';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';
/**
 * @description
 * Contains methods relating to {@link Country} entities.
 *
 * @docsCategory services
 */
export declare class CountryService {
    private connection;
    private listQueryBuilder;
    private translatableSaver;
    private eventBus;
    private translator;
    constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder, translatableSaver: TranslatableSaver, eventBus: EventBus, translator: TranslatorService);
    findAll(ctx: RequestContext, options?: ListQueryOptions<Country>, relations?: RelationPaths<Country>): Promise<PaginatedList<Translated<Country>>>;
    findOne(ctx: RequestContext, countryId: ID, relations?: RelationPaths<Country>): Promise<Translated<Country> | undefined>;
    /**
     * @description
     * Returns an array of enabled Countries, intended for use in a public-facing (ie. Shop) API.
     */
    findAllAvailable(ctx: RequestContext): Promise<Array<Translated<Country>>>;
    /**
     * @description
     * Returns a Country based on its ISO country code.
     */
    findOneByCode(ctx: RequestContext, countryCode: string): Promise<Translated<Country>>;
    create(ctx: RequestContext, input: CreateCountryInput): Promise<Translated<Country>>;
    update(ctx: RequestContext, input: UpdateCountryInput): Promise<Translated<Country>>;
    delete(ctx: RequestContext, id: ID): Promise<DeletionResponse>;
}
