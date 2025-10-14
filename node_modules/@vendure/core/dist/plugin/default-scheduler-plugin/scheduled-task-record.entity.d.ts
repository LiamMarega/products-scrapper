import { VendureEntity } from '../../entity/base/base.entity';
export declare class ScheduledTaskRecord extends VendureEntity {
    constructor(input: Partial<ScheduledTaskRecord>);
    taskId: string;
    enabled: boolean;
    lockedAt: Date | null;
    lastExecutedAt: Date | null;
    manuallyTriggeredAt: Date | null;
    lastResult: Record<string, any> | string | number | null;
}
