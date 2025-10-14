import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Success, UpdateScheduledTaskInput } from '@vendure/common/lib/generated-types';
import { ConfigService } from '../config/config.service';
import { ProcessContext } from '../process-context';
export interface TaskInfo {
    id: string;
    description: string;
    schedule: string;
    scheduleDescription: string;
    lastExecutedAt: Date | null;
    nextExecutionAt: Date | null;
    isRunning: boolean;
    lastResult: any;
    enabled: boolean;
}
/**
 * @description
 * The service that is responsible for setting up and querying the scheduled tasks.
 *
 * @since 3.3.0
 * @docsCategory scheduled-tasks
 */
export declare class SchedulerService implements OnApplicationBootstrap, OnApplicationShutdown {
    private readonly configService;
    private readonly processContext;
    private readonly jobs;
    private shouldRunTasks;
    private runningTasks;
    constructor(configService: ConfigService, processContext: ProcessContext);
    onApplicationBootstrap(): void;
    onApplicationShutdown(signal?: string): Promise<void>;
    /**
     * @description
     * Returns a list of all the scheduled tasks and their current status.
     */
    getTaskList(): Promise<TaskInfo[]>;
    updateTask(input: UpdateScheduledTaskInput): Promise<TaskInfo>;
    runTask(taskId: string): Promise<Success>;
    private createTaskInfo;
    private createCronJob;
}
