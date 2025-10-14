import { ID } from '@vendure/common/lib/shared-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomSessionFields } from '../custom-entity-fields';
import { Order } from '../order/order.entity';
/**
 * @description
 * A Session is created when a user makes a request to restricted API operations. A Session can be an {@link AnonymousSession}
 * in the case of un-authenticated users, otherwise it is an {@link AuthenticatedSession}.
 *
 * @docsCategory entities
 */
export declare abstract class Session extends VendureEntity implements HasCustomFields {
    token: string;
    expires: Date;
    invalidated: boolean;
    activeOrderId?: ID;
    activeOrder: Order | null;
    activeChannelId?: ID;
    activeChannel: Channel | null;
    customFields: CustomSessionFields;
}
