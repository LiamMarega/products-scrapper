import { PasswordHashingStrategy } from './password-hashing-strategy';
/**
 * @description
 * A hashing strategy which uses bcrypt (https://en.wikipedia.org/wiki/Bcrypt) to hash plaintext password strings.
 *
 * @docsCategory auth
 * @since 1.3.0
 */
export declare class BcryptPasswordHashingStrategy implements PasswordHashingStrategy {
    private bcrypt;
    hash(plaintext: string): Promise<string>;
    check(plaintext: string, hash: string): Promise<boolean>;
    private getBcrypt;
}
