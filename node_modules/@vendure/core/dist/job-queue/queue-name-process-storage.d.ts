import { Job } from './job';
export declare class QueueNameProcessStorage<T> {
    private items;
    set(queueName: string, process: (job: Job) => Promise<any>, listener: T): void;
    has(queueName: string, process: (job: Job) => Promise<any>): boolean;
    getAndDelete(queueName: string, process: (job: Job) => Promise<any>): T | undefined;
}
