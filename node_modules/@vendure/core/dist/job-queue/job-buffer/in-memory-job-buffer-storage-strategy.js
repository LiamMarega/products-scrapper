"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryJobBufferStorageStrategy = void 0;
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
class InMemoryJobBufferStorageStrategy {
    constructor() {
        this.bufferStorage = new Map();
    }
    async add(bufferId, job) {
        const set = this.getSet(bufferId);
        set.add(job);
        return job;
    }
    async bufferSize(bufferIds) {
        var _a, _b;
        const ids = bufferIds !== null && bufferIds !== void 0 ? bufferIds : Array.from(this.bufferStorage.keys());
        const result = {};
        for (const id of ids) {
            const size = (_b = (_a = this.bufferStorage.get(id)) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : 0;
            result[id] = size;
        }
        return result;
    }
    async flush(bufferIds) {
        var _a, _b;
        const ids = bufferIds !== null && bufferIds !== void 0 ? bufferIds : Array.from(this.bufferStorage.keys());
        const result = {};
        for (const id of ids) {
            const jobs = Array.from((_a = this.bufferStorage.get(id)) !== null && _a !== void 0 ? _a : []);
            (_b = this.bufferStorage.get(id)) === null || _b === void 0 ? void 0 : _b.clear();
            result[id] = jobs;
        }
        return result;
    }
    getSet(bufferId) {
        const set = this.bufferStorage.get(bufferId);
        if (set) {
            return set;
        }
        else {
            const newSet = new Set();
            this.bufferStorage.set(bufferId, newSet);
            return newSet;
        }
    }
}
exports.InMemoryJobBufferStorageStrategy = InMemoryJobBufferStorageStrategy;
//# sourceMappingURL=in-memory-job-buffer-storage-strategy.js.map