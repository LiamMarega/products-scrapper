"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopLogger = void 0;
/**
 * A logger that does not log.
 */
class NoopLogger {
    debug(message, context) {
        // noop!
    }
    error(message, context, trace) {
        // noop!
    }
    info(message, context) {
        // noop!
    }
    verbose(message, context) {
        // noop!
    }
    warn(message, context) {
        // noop!
    }
}
exports.NoopLogger = NoopLogger;
//# sourceMappingURL=noop-logger.js.map