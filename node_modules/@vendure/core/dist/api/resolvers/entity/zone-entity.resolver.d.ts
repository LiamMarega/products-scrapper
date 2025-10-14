import { Country } from '../../../entity/region/country.entity';
import { Zone } from '../../../entity/zone/zone.entity';
import { ZoneService } from '../../../service/services/zone.service';
import { RequestContext } from '../../common/request-context';
export declare class ZoneEntityResolver {
    private zoneService;
    constructor(zoneService: ZoneService);
    members(ctx: RequestContext, zone: Zone): Promise<Country[]>;
}
