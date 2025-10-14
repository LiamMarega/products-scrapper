import { DeletionResponse, MutationCreateCountryArgs, MutationDeleteCountriesArgs, MutationDeleteCountryArgs, MutationUpdateCountryArgs, QueryCountriesArgs, QueryCountryArgs } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { Translated } from '../../../common/types/locale-types';
import { Country } from '../../../entity/region/country.entity';
import { CountryService } from '../../../service/services/country.service';
import { RequestContext } from '../../common/request-context';
import { RelationPaths } from '../../decorators/relations.decorator';
export declare class CountryResolver {
    private countryService;
    constructor(countryService: CountryService);
    countries(ctx: RequestContext, args: QueryCountriesArgs, relations: RelationPaths<Country>): Promise<PaginatedList<Translated<Country>>>;
    country(ctx: RequestContext, args: QueryCountryArgs, relations: RelationPaths<Country>): Promise<Translated<Country> | undefined>;
    createCountry(ctx: RequestContext, args: MutationCreateCountryArgs): Promise<Translated<Country>>;
    updateCountry(ctx: RequestContext, args: MutationUpdateCountryArgs): Promise<Translated<Country>>;
    deleteCountry(ctx: RequestContext, args: MutationDeleteCountryArgs): Promise<DeletionResponse>;
    deleteCountries(ctx: RequestContext, args: MutationDeleteCountriesArgs): Promise<DeletionResponse[]>;
}
