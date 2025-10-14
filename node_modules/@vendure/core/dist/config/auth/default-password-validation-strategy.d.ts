import { RequestContext } from '../../api/common/request-context';
import { PasswordValidationStrategy } from './password-validation-strategy';
/**
 * @description
 * The DefaultPasswordValidationStrategy allows you to specify a minimum length and/or
 * a regular expression to match passwords against. The default `maxLength` is `72`.
 *
 * TODO:
 * By default, the `minLength` will be set to `4`. This is rather permissive and is only
 * this way in order to reduce the risk of backward-compatibility breaks. In the next major version
 * this default will be made more strict.
 *
 * @docsCategory auth
 * @since 1.5.0
 */
export declare class DefaultPasswordValidationStrategy implements PasswordValidationStrategy {
    private options;
    constructor(options: {
        minLength?: number;
        maxLength?: number;
        regexp?: RegExp;
    });
    validate(ctx: RequestContext, password: string): boolean | string;
}
