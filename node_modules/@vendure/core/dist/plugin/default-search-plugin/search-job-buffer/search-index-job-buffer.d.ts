import { Job } from '../../../job-queue/job';
import { JobBuffer } from '../../../job-queue/job-buffer/job-buffer';
import { UpdateIndexQueueJobData } from '../types';
export declare class SearchIndexJobBuffer implements JobBuffer<UpdateIndexQueueJobData> {
    readonly id = "search-plugin-update-search-index";
    collect(job: Job<UpdateIndexQueueJobData>): boolean | Promise<boolean>;
    reduce(collectedJobs: Array<Job<UpdateIndexQueueJobData>>): Array<Job<any>>;
    /**
     * Removes items from the array based on the filterFn and returns a new array with only the removed
     * items. The original input array is mutated.
     */
    private removeBy;
}
