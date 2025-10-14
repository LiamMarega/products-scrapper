import { AssetType } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Observable, Observer } from 'rxjs';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { RelationPaths } from '../api/decorators/relations.decorator';
import { VendureEntity } from '../entity/base/base.entity';
/**
 * Takes a predicate function and returns a negated version.
 */
export declare function not(predicate: (...args: any[]) => boolean): (...args: any[]) => boolean;
/**
 * Returns a predicate function which returns true if the item is found in the set,
 * as determined by a === equality check on the given compareBy property.
 */
export declare function foundIn<T>(set: T[], compareBy: keyof T): (item: T) => boolean;
/**
 * Identity function which asserts to the type system that a promise which can resolve to T or undefined
 * does in fact resolve to T.
 * Used when performing a "find" operation on an entity which we are sure exists, as in the case that we
 * just successfully created or updated it.
 */
export declare function assertFound<T>(promise: Promise<T | undefined | null>): Promise<T>;
/**
 * Compare ID values for equality, taking into account the fact that they may not be of matching types
 * (string or number).
 */
export declare function idsAreEqual(id1?: ID | null, id2?: ID | null): boolean;
/**
 * Returns the AssetType based on the mime type.
 */
export declare function getAssetType(mimeType: string): AssetType;
/**
 * A simple normalization for email addresses. Lowercases the whole address,
 * even though technically the local part (before the '@') is case-sensitive
 * per the spec. In practice, however, it seems safe to treat emails as
 * case-insensitive to allow for users who might vary the usage of
 * upper/lower case. See more discussion here: https://ux.stackexchange.com/a/16849
 */
export declare function normalizeEmailAddress(input: string): string;
/**
 * This is a "good enough" check for whether the input is an email address.
 * From https://stackoverflow.com/a/32686261
 * It is used to determine whether to apply normalization (lower-casing)
 * when comparing identifiers in user lookups. This allows case-sensitive
 * identifiers for other authentication methods.
 */
export declare function isEmailAddressLike(input: string): boolean;
/**
 * Converts a value that may be wrapped into a Promise or Observable into a Promise-wrapped
 * value.
 */
export declare function awaitPromiseOrObservable<T>(value: T | Promise<T> | Observable<T>): Promise<T>;
/**
 * @description
 * Returns an observable which executes the given async work function and completes with
 * the returned value. This is useful in methods which need to return
 * an Observable but also want to work with async (Promise-returning) code.
 *
 * @example
 * ```ts
 * \@Controller()
 * export class MyWorkerController {
 *
 *     \@MessagePattern('test')
 *     handleTest() {
 *         return asyncObservable(async observer => {
 *             const value = await this.connection.fetchSomething();
 *             return value;
 *         });
 *     }
 * }
 * ```
 */
export declare function asyncObservable<T>(work: (observer: Observer<T>) => Promise<T | void>): Observable<T>;
export declare function convertRelationPaths<T extends VendureEntity>(relationPaths?: RelationPaths<T> | null): FindOptionsRelations<T> | undefined;
