import { UpdateScheduledTaskInput } from '@vendure/common/lib/generated-types';
import { ScheduledTask } from './scheduled-task';
import { SchedulerStrategy, TaskReport } from './scheduler-strategy';
export declare class NoopSchedulerStrategy implements SchedulerStrategy {
    getTasks(): Promise<TaskReport[]>;
    getTask(id: string): Promise<TaskReport | undefined>;
    executeTask(task: ScheduledTask): () => Promise<void>;
    updateTask(input: UpdateScheduledTaskInput): Promise<TaskReport>;
    triggerTask(task: ScheduledTask): Promise<void>;
}
