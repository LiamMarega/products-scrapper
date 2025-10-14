"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchIndexJobBuffer = void 0;
const unique_1 = require("@vendure/common/lib/unique");
const job_1 = require("../../../job-queue/job");
class SearchIndexJobBuffer {
    constructor() {
        this.id = 'search-plugin-update-search-index';
    }
    collect(job) {
        return (job.queueName === 'update-search-index' &&
            ['update-product', 'update-variants', 'update-variants-by-id'].includes(job.data.type));
    }
    reduce(collectedJobs) {
        const variantsJobs = this.removeBy(collectedJobs, item => item.data.type === 'update-variants-by-id' || item.data.type === 'update-variants');
        const productsJobs = this.removeBy(collectedJobs, item => item.data.type === 'update-product');
        const jobsToAdd = [...collectedJobs];
        if (variantsJobs.length) {
            const variantIdsToUpdate = [];
            for (const job of variantsJobs) {
                const ids = job.data.type === 'update-variants-by-id' ? job.data.ids : job.data.variantIds;
                variantIdsToUpdate.push(...ids);
            }
            const referenceJob = variantsJobs[0];
            const batchedVariantJob = new job_1.Job(Object.assign(Object.assign({}, referenceJob), { id: undefined, data: {
                    type: 'update-variants-by-id',
                    ids: (0, unique_1.unique)(variantIdsToUpdate),
                    ctx: referenceJob.data.ctx,
                } }));
            jobsToAdd.push(batchedVariantJob);
        }
        if (productsJobs.length) {
            const seenIds = new Set();
            const uniqueProductJobs = [];
            for (const job of productsJobs) {
                if (seenIds.has(job.data.productId)) {
                    continue;
                }
                uniqueProductJobs.push(job);
                seenIds.add(job.data.productId);
            }
            jobsToAdd.push(...uniqueProductJobs);
        }
        return jobsToAdd;
    }
    /**
     * Removes items from the array based on the filterFn and returns a new array with only the removed
     * items. The original input array is mutated.
     */
    removeBy(input, filterFn) {
        const removed = [];
        for (let i = input.length - 1; i >= 0; i--) {
            const item = input[i];
            if (filterFn(item)) {
                removed.push(item);
                input.splice(i, 1);
            }
        }
        return removed;
    }
}
exports.SearchIndexJobBuffer = SearchIndexJobBuffer;
//# sourceMappingURL=search-index-job-buffer.js.map