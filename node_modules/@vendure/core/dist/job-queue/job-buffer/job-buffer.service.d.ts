import { ConfigService } from '../../config/config.service';
import { Job } from '../job';
import { JobBuffer } from './job-buffer';
/**
 * @description
 * Used to manage {@link JobBuffer}s.Primarily intended to be used internally by the {@link JobQueueService}, which
 * exposes its public-facing functionality.
 */
export declare class JobBufferService {
    private configService;
    private buffers;
    private storageStrategy;
    constructor(configService: ConfigService);
    addBuffer(buffer: JobBuffer<any>): void;
    removeBuffer(buffer: JobBuffer<any>): void;
    add(job: Job): Promise<boolean>;
    bufferSize(forBuffers?: Array<JobBuffer | string>): Promise<{
        [bufferId: string]: number;
    }>;
    flush(forBuffers?: Array<JobBuffer | string>): Promise<Job[]>;
}
