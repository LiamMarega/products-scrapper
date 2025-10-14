import { CustomerGroup } from '../../../entity/customer-group/customer-group.entity';
import { TaxRate } from '../../../entity/tax-rate/tax-rate.entity';
import { TaxRateService } from '../../../service/services/tax-rate.service';
import { RequestContext } from '../../common/request-context';
export declare class TaxRateEntityResolver {
    private taxRateService;
    constructor(taxRateService: TaxRateService);
    customerGroup(ctx: RequestContext, taxRate: TaxRate): Promise<CustomerGroup | undefined>;
}
