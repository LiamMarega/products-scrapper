"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionJobBuffer = void 0;
const unique_1 = require("@vendure/common/lib/unique");
const job_1 = require("../../../job-queue/job");
class CollectionJobBuffer {
    constructor() {
        this.id = 'search-plugin-apply-collection-filters';
    }
    collect(job) {
        return job.queueName === 'apply-collection-filters';
    }
    reduce(collectedJobs) {
        const collectionIdsToUpdate = collectedJobs.reduce((result, job) => {
            return [...result, ...job.data.collectionIds];
        }, []);
        const referenceJob = collectedJobs[0];
        const batchedCollectionJob = new job_1.Job(Object.assign(Object.assign({}, referenceJob), { id: undefined, data: {
                collectionIds: (0, unique_1.unique)(collectionIdsToUpdate),
                ctx: referenceJob.data.ctx,
                applyToChangedVariantsOnly: referenceJob.data.applyToChangedVariantsOnly,
            } }));
        return [batchedCollectionJob];
    }
}
exports.CollectionJobBuffer = CollectionJobBuffer;
//# sourceMappingURL=collection-job-buffer.js.map