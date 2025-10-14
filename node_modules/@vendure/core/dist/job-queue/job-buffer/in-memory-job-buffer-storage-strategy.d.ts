import { Job } from '../job';
import { JobBufferStorageStrategy } from './job-buffer-storage-strategy';
/**
 * @description
 * A {@link JobBufferStorageStrategy} which keeps the buffered jobs in memory. Should
 * _not_ be used in production, since it will lose data in the event of the server
 * stopping.
 *
 * Instead, use the {@link DefaultJobQueuePlugin} with the `useDatabaseForBuffer: true` option set,
 * or the {@link BullMQJobQueuePlugin} or another custom strategy with persistent storage.
 *
 * @since 1.3.0
 * @docsCategory JobQueue
 */
export declare class InMemoryJobBufferStorageStrategy implements JobBufferStorageStrategy {
    protected bufferStorage: Map<string, Set<Job<any>>>;
    add(bufferId: string, job: Job): Promise<Job>;
    bufferSize(bufferIds?: string[]): Promise<{
        [bufferId: string]: number;
    }>;
    flush(bufferIds?: string[]): Promise<{
        [bufferId: string]: Job[];
    }>;
    private getSet;
}
