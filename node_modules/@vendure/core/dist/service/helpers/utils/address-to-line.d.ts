import { OrderAddress } from '@vendure/common/lib/generated-types';
import { Address } from '../../../entity/address/address.entity';
/**
 * Given an Address object, this function converts it into a single line
 * consisting of streetLine1, (postalCode), (countryCode).
 */
export declare function addressToLine(address: Address | OrderAddress): string;
