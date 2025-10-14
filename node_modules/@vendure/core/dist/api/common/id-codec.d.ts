import { EntityIdStrategy } from '../../config/entity/entity-id-strategy';
/**
 * This service is responsible for encoding/decoding entity IDs according to the configured EntityIdStrategy.
 * It should only need to be used in resolvers - the design is that once a request hits the business logic layer
 * (ProductService etc) all entity IDs are in the form used as the primary key in the database.
 */
export declare class IdCodec {
    private entityIdStrategy;
    constructor(entityIdStrategy: EntityIdStrategy<any>);
    /**
     * Decode an id from the client into the format used as the database primary key.
     * Acts recursively on all objects containing an "id" property.
     *
     * @param target - The object to be decoded
     * @param transformKeys - An optional array of keys of the target to be decoded. If not defined,
     * then the default recursive behaviour will be used.
     * @return A decoded clone of the target
     */
    decode<T extends string | number | object | undefined>(target: T, transformKeys?: string[]): T;
    /**
     * Encode any entity ids according to the encode.
     * Acts recursively on all objects containing an "id" property.
     *
     * @param target - The object to be encoded
     * @param transformKeys - An optional array of keys of the target to be encoded. If not defined,
     * then the default recursive behaviour will be used.
     * @return An encoded clone of the target
     */
    encode<T extends string | number | boolean | object | undefined>(target: T, transformKeys?: string[]): T;
    private transformRecursive;
    private transform;
    private isSimpleObject;
    private isObject;
}
