import { Job } from '../../../job-queue/job';
export declare class JobEntityResolver {
    private readonly graphQlMaxInt;
    duration(job: Job): Promise<number>;
    data(job: Job): Promise<any>;
    private isSerializedRequestContext;
}
