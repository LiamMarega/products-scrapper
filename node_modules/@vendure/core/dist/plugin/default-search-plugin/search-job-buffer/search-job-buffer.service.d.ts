import { OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import { JobQueueService } from '../../../job-queue/job-queue.service';
import { CollectionJobBuffer } from './collection-job-buffer';
import { SearchIndexJobBuffer } from './search-index-job-buffer';
export declare class SearchJobBufferService implements OnApplicationBootstrap {
    private jobQueueService;
    private configService;
    private bufferUpdates;
    readonly searchIndexJobBuffer: SearchIndexJobBuffer;
    readonly collectionJobBuffer: CollectionJobBuffer;
    constructor(jobQueueService: JobQueueService, configService: ConfigService, bufferUpdates: boolean);
    onApplicationBootstrap(): any;
    getPendingSearchUpdates(): Promise<number>;
    runPendingSearchUpdates(): Promise<void>;
}
