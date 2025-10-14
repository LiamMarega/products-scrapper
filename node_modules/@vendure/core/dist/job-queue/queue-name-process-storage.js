"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueNameProcessStorage = void 0;
class QueueNameProcessStorage {
    constructor() {
        this.items = new Map();
    }
    set(queueName, process, listener) {
        let items = this.items.get(queueName);
        if (!items) {
            items = new Map();
            this.items.set(queueName, items);
        }
        items.set(process, listener);
    }
    has(queueName, process) {
        const items = this.items.get(queueName);
        if (!items) {
            return false;
        }
        return items.has(process);
    }
    getAndDelete(queueName, process) {
        const items = this.items.get(queueName);
        if (!items) {
            return;
        }
        const item = items.get(process);
        if (!item) {
            return;
        }
        items.delete(process);
        if (items.size === 0) {
            this.items.delete(queueName);
        }
        return item;
    }
}
exports.QueueNameProcessStorage = QueueNameProcessStorage;
//# sourceMappingURL=queue-name-process-storage.js.map