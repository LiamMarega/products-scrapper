"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptPasswordHashingStrategy = void 0;
const SALT_ROUNDS = 12;
/**
 * @description
 * A hashing strategy which uses bcrypt (https://en.wikipedia.org/wiki/Bcrypt) to hash plaintext password strings.
 *
 * @docsCategory auth
 * @since 1.3.0
 */
class BcryptPasswordHashingStrategy {
    hash(plaintext) {
        this.getBcrypt();
        return this.bcrypt.hash(plaintext, SALT_ROUNDS);
    }
    check(plaintext, hash) {
        this.getBcrypt();
        return this.bcrypt.compare(plaintext, hash);
    }
    getBcrypt() {
        if (!this.bcrypt) {
            // The bcrypt lib is lazily loaded so that if we want to run Vendure
            // in an environment that does not support native Node modules
            // (such as an online sandbox like Stackblitz) the bcrypt dependency
            // does not get loaded when linking the source files on startup.
            this.bcrypt = require('bcrypt');
        }
    }
}
exports.BcryptPasswordHashingStrategy = BcryptPasswordHashingStrategy;
//# sourceMappingURL=bcrypt-password-hashing-strategy.js.map