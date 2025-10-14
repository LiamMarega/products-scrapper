import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity } from '../../entity/base/base.entity';
import { JobConfig } from '../../job-queue/types';
export declare class JobRecordBuffer extends VendureEntity {
    constructor(input: DeepPartial<JobRecordBuffer>);
    bufferId: string;
    job: JobConfig<any>;
}
