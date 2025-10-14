import { RequestContext } from '../../api/common/request-context';
import { Job } from '../../job-queue/job';
/**
 * @description
 * This service allows a concrete search service to override its behaviour
 * by passing itself to the `adopt()` method.
 *
 * @docsCategory services
 */
export declare class SearchService {
    private override;
    /**
     * @description
     * Adopt a concrete search service implementation to pass through the
     * calls to.
     */
    adopt(override: Pick<SearchService, 'reindex'>): void;
    reindex(ctx: RequestContext): Promise<Job>;
}
