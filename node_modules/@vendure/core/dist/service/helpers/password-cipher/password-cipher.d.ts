import { ConfigService } from '../../../config/config.service';
/**
 * @description
 * Used in the {@link NativeAuthenticationStrategy} when hashing and checking user passwords.
 */
export declare class PasswordCipher {
    private configService;
    constructor(configService: ConfigService);
    hash(plaintext: string): Promise<string>;
    check(plaintext: string, hash: string): Promise<boolean>;
}
