import { FindOneOptions } from 'typeorm';
import { FindOptionsRelationByString } from 'typeorm/find-options/FindOptionsRelations';
/**
 * Some internal APIs depend on the TypeORM FindOptions `relations` property being a string array.
 * This function converts the new-style FindOptionsRelations object to a string array.
 */
export declare function findOptionsObjectToArray<T>(input: NonNullable<FindOneOptions['relations']>, parentKey?: string): FindOptionsRelationByString;
