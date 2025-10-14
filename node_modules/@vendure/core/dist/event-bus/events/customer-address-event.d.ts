import { CreateAddressInput, UpdateAddressInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api';
import { Address } from '../../entity/address/address.entity';
import { VendureEntityEvent } from '../vendure-entity-event';
/**
 * Possible input types for Address mutations
 */
type CustomerAddressInputTypes = CreateAddressInput | UpdateAddressInput | ID;
/**
 * @description
 * This event is fired whenever a {@link Address} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export declare class CustomerAddressEvent extends VendureEntityEvent<Address, CustomerAddressInputTypes> {
    ctx: RequestContext;
    entity: Address;
    type: 'created' | 'updated' | 'deleted';
    input?: CustomerAddressInputTypes | undefined;
    constructor(ctx: RequestContext, entity: Address, type: 'created' | 'updated' | 'deleted', input?: CustomerAddressInputTypes | undefined);
    /**
     * Return an address field to become compatible with the
     * deprecated old version of CustomerAddressEvent
     * @deprecated Use `entity` instead
     */
    get address(): Address;
}
export {};
