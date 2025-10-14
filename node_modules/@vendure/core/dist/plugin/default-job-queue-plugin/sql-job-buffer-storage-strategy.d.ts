import { Injector } from '../../common/injector';
import { Job } from '../../job-queue/job';
import { JobBufferStorageStrategy } from '../../job-queue/job-buffer/job-buffer-storage-strategy';
/**
 * @description
 * This stores the buffered jobs in the database.
 */
export declare class SqlJobBufferStorageStrategy implements JobBufferStorageStrategy {
    private connection;
    init(injector: Injector): void;
    add(bufferId: string, job: Job): Promise<Job>;
    bufferSize(bufferIds?: string[]): Promise<{
        [bufferId: string]: number;
    }>;
    flush(bufferIds?: string[]): Promise<{
        [bufferId: string]: Job[];
    }>;
    private toJobConfig;
}
