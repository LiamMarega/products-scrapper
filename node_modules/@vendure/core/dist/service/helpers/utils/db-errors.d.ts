/**
 * Returns true if the given error represents a foreign key constraint violation
 * across supported drivers (Postgres, MySQL/MariaDB, SQLite).
 */
export declare function isForeignKeyViolationError(e: unknown): boolean;
