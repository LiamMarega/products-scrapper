import { JobState } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity } from '../../entity/base/base.entity';
export declare class JobRecord extends VendureEntity {
    constructor(input: DeepPartial<JobRecord>);
    queueName: string;
    data: any;
    state: JobState;
    progress: number;
    result: any;
    error: string;
    startedAt?: Date;
    settledAt?: Date;
    isSettled: boolean;
    retries: number;
    attempts: number;
}
