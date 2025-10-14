import { VendureEntity } from '../../../entity/base/base.entity';
export type InputPatch<T> = {
    [K in keyof T]?: T[K] | null;
};
/**
 * Updates only the specified properties from an Input object as long as the value is not
 * undefined. Null values can be passed, however, which will set the corresponding entity
 * field to "null". So care must be taken that this is only done on nullable fields.
 */
export declare function patchEntity<T extends VendureEntity, I extends InputPatch<T>>(entity: T, input: I): T;
