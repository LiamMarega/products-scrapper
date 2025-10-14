import { Country } from '../../../entity/region/country.entity';
import { LocaleStringHydrator } from '../../../service/helpers/locale-string-hydrator/locale-string-hydrator';
import { RequestContext } from '../../common/request-context';
export declare class CountryEntityResolver {
    private localeStringHydrator;
    constructor(localeStringHydrator: LocaleStringHydrator);
    name(ctx: RequestContext, country: Country): Promise<string>;
    languageCode(ctx: RequestContext, country: Country): Promise<string>;
}
