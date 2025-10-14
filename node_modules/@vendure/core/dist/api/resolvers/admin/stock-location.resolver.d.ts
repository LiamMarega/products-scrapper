import { MutationAssignStockLocationsToChannelArgs, MutationCreateStockLocationArgs, MutationDeleteStockLocationArgs, MutationDeleteStockLocationsArgs, MutationRemoveStockLocationsFromChannelArgs, MutationUpdateStockLocationArgs, QueryStockLocationArgs, QueryStockLocationsArgs } from '@vendure/common/lib/generated-types';
import { StockLocationService } from '../../../service/services/stock-location.service';
import { RequestContext } from '../../common/request-context';
export declare class StockLocationResolver {
    private stockLocationService;
    constructor(stockLocationService: StockLocationService);
    stockLocation(ctx: RequestContext, args: QueryStockLocationArgs): Promise<import("../../..").StockLocation | undefined>;
    stockLocations(ctx: RequestContext, args: QueryStockLocationsArgs): Promise<import("@vendure/common/lib/shared-types").PaginatedList<import("../../..").StockLocation>>;
    createStockLocation(ctx: RequestContext, args: MutationCreateStockLocationArgs): Promise<import("../../..").StockLocation>;
    updateStockLocation(ctx: RequestContext, args: MutationUpdateStockLocationArgs): Promise<import("../../..").StockLocation>;
    deleteStockLocation(ctx: RequestContext, args: MutationDeleteStockLocationArgs): Promise<import("@vendure/common/lib/generated-types").DeletionResponse>;
    deleteStockLocations(ctx: RequestContext, args: MutationDeleteStockLocationsArgs): Promise<import("@vendure/common/lib/generated-types").DeletionResponse[]>;
    assignStockLocationsToChannel(ctx: RequestContext, args: MutationAssignStockLocationsToChannelArgs): Promise<import("../../..").StockLocation[]>;
    removeStockLocationsFromChannel(ctx: RequestContext, args: MutationRemoveStockLocationsFromChannelArgs): Promise<import("../../..").StockLocation[]>;
}
