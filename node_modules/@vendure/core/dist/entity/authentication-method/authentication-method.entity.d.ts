import { VendureEntity } from '../base/base.entity';
import { User } from '../user/user.entity';
/**
 * @description
 * An AuthenticationMethod represents the means by which a {@link User} is authenticated. There are two kinds:
 * {@link NativeAuthenticationMethod} and {@link ExternalAuthenticationMethod}.
 *
 * @docsCategory entities
 * @docsPage AuthenticationMethod
 */
export declare abstract class AuthenticationMethod extends VendureEntity {
    user: User;
}
