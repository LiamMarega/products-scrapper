import { MutationRunScheduledTaskArgs, MutationUpdateScheduledTaskArgs } from '@vendure/common/lib/generated-types';
import { SchedulerService } from '../../../scheduler/scheduler.service';
export declare class ScheduledTaskResolver {
    private readonly schedulerService;
    constructor(schedulerService: SchedulerService);
    scheduledTasks(): Promise<import("../../../scheduler/scheduler.service").TaskInfo[]>;
    updateScheduledTask({ input }: MutationUpdateScheduledTaskArgs): Promise<import("../../../scheduler/scheduler.service").TaskInfo>;
    runScheduledTask({ id }: MutationRunScheduledTaskArgs): Promise<import("@vendure/common/lib/generated-types").Success>;
}
