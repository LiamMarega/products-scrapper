"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const vendure_logger_1 = require("../config/logger/vendure-logger");
/**
 * @description
 * A Job represents a piece of work to be run in the background, i.e. outside the request-response cycle.
 * It is intended to be used for long-running work triggered by API requests. Jobs should now generally
 * be directly instantiated. Rather, the {@link JobQueue} `add()` method should be used to create and
 * add a new Job to a queue.
 *
 * @docsCategory JobQueue
 * @docsPage Job
 * @docsWeight 0
 */
class Job {
    get name() {
        return this.queueName;
    }
    get data() {
        return this._data;
    }
    get state() {
        return this._state;
    }
    get progress() {
        return this._progress;
    }
    get result() {
        return this._result;
    }
    get error() {
        return this._error;
    }
    get isSettled() {
        return (!!this._settledAt &&
            (this._state === generated_types_1.JobState.COMPLETED ||
                this._state === generated_types_1.JobState.FAILED ||
                this._state === generated_types_1.JobState.CANCELLED));
    }
    get startedAt() {
        return this._startedAt;
    }
    get settledAt() {
        return this._settledAt;
    }
    get duration() {
        if (this.state === generated_types_1.JobState.PENDING || this.state === generated_types_1.JobState.RETRYING) {
            return 0;
        }
        const end = this._settledAt || new Date();
        return +end - +(this._startedAt || end);
    }
    get attempts() {
        return this._attempts;
    }
    constructor(config) {
        this.eventListeners = {
            progress: [],
        };
        this.queueName = config.queueName;
        this._data = this.ensureDataIsSerializable(config.data);
        this.id = config.id || null;
        this._state = config.state || generated_types_1.JobState.PENDING;
        this.retries = config.retries || 0;
        this._attempts = config.attempts || 0;
        this._progress = config.progress || 0;
        this.createdAt = config.createdAt || new Date();
        this._result = config.result;
        this._error = config.error;
        this._startedAt = config.startedAt;
        this._settledAt = config.settledAt;
    }
    /**
     * @description
     * Calling this signifies that the job work has started. This method should be
     * called in the {@link JobQueueStrategy} `next()` method.
     */
    start() {
        var _a, _b;
        if (this._state === generated_types_1.JobState.PENDING || this._state === generated_types_1.JobState.RETRYING) {
            this._state = generated_types_1.JobState.RUNNING;
            this._startedAt = new Date();
            this._attempts++;
            vendure_logger_1.Logger.debug(`Job ${(_b = (_a = this.id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : 'null'} [${this.queueName}] starting (attempt ${this._attempts} of ${this.retries + 1})`);
        }
    }
    /**
     * @description
     * Sets the progress (0 - 100) of the job.
     */
    setProgress(percent) {
        this._progress = Math.min(percent || 0, 100);
        this.fireEvent('progress');
    }
    /**
     * @description
     * Calling this method signifies that the job succeeded. The result
     * will be stored in the `Job.result` property.
     */
    complete(result) {
        var _a, _b;
        this._result = result;
        this._progress = 100;
        this._state = generated_types_1.JobState.COMPLETED;
        this._settledAt = new Date();
        vendure_logger_1.Logger.debug(`Job ${(_b = (_a = this.id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : 'null'} [${this.queueName}] completed`);
    }
    /**
     * @description
     * Calling this method signifies that the job failed.
     */
    fail(err) {
        var _a, _b, _c, _d;
        this._error = (err === null || err === void 0 ? void 0 : err.message) ? err.message : String(err);
        this._progress = 0;
        if (this.retries >= this._attempts) {
            this._state = generated_types_1.JobState.RETRYING;
            vendure_logger_1.Logger.warn(`Job ${(_b = (_a = this.id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : 'null'} [${this.queueName}] failed (attempt ${this._attempts} of ${this.retries + 1})`);
        }
        else {
            if (this._state !== generated_types_1.JobState.CANCELLED) {
                this._state = generated_types_1.JobState.FAILED;
                vendure_logger_1.Logger.warn(`Job ${(_d = (_c = this.id) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : 'null'} [${this.queueName}] failed and will not retry.`);
            }
            this._settledAt = new Date();
        }
    }
    cancel() {
        this._settledAt = new Date();
        this._state = generated_types_1.JobState.CANCELLED;
    }
    /**
     * @description
     * Sets a RUNNING job back to PENDING. Should be used when the JobQueue is being
     * destroyed before the job has been completed.
     */
    defer() {
        var _a, _b;
        if (this._state === generated_types_1.JobState.RUNNING) {
            this._state = generated_types_1.JobState.PENDING;
            this._attempts = 0;
            vendure_logger_1.Logger.debug(`Job ${(_b = (_a = this.id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : 'null'} [${this.queueName}] deferred back to PENDING state`);
        }
    }
    /**
     * @description
     * Used to register event handler for job events
     */
    on(eventType, listener) {
        this.eventListeners[eventType].push(listener);
    }
    off(eventType, listener) {
        const idx = this.eventListeners[eventType].indexOf(listener);
        if (idx !== -1) {
            this.eventListeners[eventType].splice(idx, 1);
        }
    }
    fireEvent(eventType) {
        for (const listener of this.eventListeners[eventType]) {
            listener(this);
        }
    }
    /**
     * All data in a job must be serializable. This method handles certain problem cases such as when
     * the data is a class instance with getters. Even though technically the "data" object should
     * already be serializable per the TS type, in practice data can slip through due to loss of
     * type safety.
     */
    ensureDataIsSerializable(data, depth = 0, seen = new WeakMap(), path = []) {
        if (10 < depth) {
            return '[max depth reached]';
        }
        if (data === null || data === undefined) {
            return data;
        }
        // Handle Date objects
        if (data instanceof Date) {
            return data.toISOString();
        }
        if (typeof data === 'object' && data !== null) {
            const seenData = seen.get(data);
            if (seenData && seenData.length < path.length) {
                return `[circular *${path.join('.')}]`;
            }
            seen.set(data, path);
        }
        depth++;
        let output;
        if ((0, shared_utils_1.isObject)(data)) {
            output = {};
            // If the object has a `.toJSON()` function defined, then
            // prefer it to any other type of serialization.
            if (this.hasToJSONFunction(data)) {
                output = data.toJSON();
            }
            else {
                for (const key of Object.keys(data)) {
                    output[key] = this.ensureDataIsSerializable(data[key], depth, seen, path.concat(key));
                }
                if ((0, shared_utils_1.isClassInstance)(data)) {
                    const descriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(data));
                    for (const name of Object.keys(descriptors)) {
                        const descriptor = descriptors[name];
                        if (typeof descriptor.get === 'function') {
                            output[name] = data[name];
                        }
                    }
                }
            }
        }
        else if (Array.isArray(data)) {
            if (!output) {
                output = [];
            }
            data.forEach((item, i) => {
                output[i] = this.ensureDataIsSerializable(item, depth, seen, path.concat(i.toString()));
            });
        }
        else {
            return data;
        }
        return output;
    }
    hasToJSONFunction(obj) {
        return typeof (obj === null || obj === void 0 ? void 0 : obj.toJSON) === 'function';
    }
}
exports.Job = Job;
//# sourceMappingURL=job.js.map