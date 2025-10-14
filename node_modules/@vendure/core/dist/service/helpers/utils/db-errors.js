"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isForeignKeyViolationError = isForeignKeyViolationError;
/**
 * Returns true if the given error represents a foreign key constraint violation
 * across supported drivers (Postgres, MySQL/MariaDB, SQLite).
 */
function isForeignKeyViolationError(e) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const err = e || {};
    const code = (_d = (_c = (_a = err.code) !== null && _a !== void 0 ? _a : (_b = err.driverError) === null || _b === void 0 ? void 0 : _b.code) !== null && _c !== void 0 ? _c : err.errno) !== null && _d !== void 0 ? _d : (_e = err.driverError) === null || _e === void 0 ? void 0 : _e.errno;
    // Postgres: 23503, MySQL/MariaDB: 1451/1452, SQLite: SQLITE_CONSTRAINT_FOREIGNKEY,
    if (code === '23503' || code === 1451 || code === 1452 || code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        return true;
    }
    const msg = String((_h = (_f = err.message) !== null && _f !== void 0 ? _f : (_g = err.driverError) === null || _g === void 0 ? void 0 : _g.message) !== null && _h !== void 0 ? _h : '');
    return /\bforeign key\b/i.test(msg);
}
//# sourceMappingURL=db-errors.js.map