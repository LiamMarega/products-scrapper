"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationDiffer = void 0;
const errors_1 = require("../../../common/error/errors");
const utils_1 = require("../../../common/utils");
/**
 * This class is to be used when performing an update on a Translatable entity.
 */
class TranslationDiffer {
    constructor(translationCtor, connection) {
        this.translationCtor = translationCtor;
        this.connection = connection;
    }
    /**
     * Compares the existing translations with the updated translations and produces a diff of
     * added, removed and updated translations.
     */
    diff(existing, updated) {
        if (updated) {
            const translationEntities = this.translationInputsToEntities(updated, existing);
            const toAdd = translationEntities.filter((0, utils_1.not)((0, utils_1.foundIn)(existing, 'languageCode')));
            const toUpdate = translationEntities.filter((0, utils_1.foundIn)(existing, 'languageCode'));
            return { toUpdate, toAdd };
        }
        else {
            return {
                toUpdate: [],
                toAdd: [],
            };
        }
    }
    async applyDiff(ctx, entity, { toUpdate, toAdd }) {
        if (toUpdate.length) {
            for (const translation of toUpdate) {
                // any cast below is required due to TS issue: https://github.com/Microsoft/TypeScript/issues/21592
                const updated = await this.connection
                    .getRepository(ctx, this.translationCtor)
                    .save(translation);
                const index = entity.translations.findIndex(t => t.languageCode === updated.languageCode);
                entity.translations.splice(index, 1, updated);
            }
        }
        if (toAdd.length) {
            for (const translation of toAdd) {
                translation.base = entity;
                let newTranslation;
                try {
                    newTranslation = await this.connection
                        .getRepository(ctx, this.translationCtor)
                        .save(translation);
                }
                catch (err) {
                    throw new errors_1.InternalServerError(err.message);
                }
                entity.translations.push(newTranslation);
            }
        }
        return entity;
    }
    translationInputsToEntities(inputs, existing) {
        return inputs.map(input => {
            const counterpart = existing.find(e => e.languageCode === input.languageCode);
            // any cast below is required due to TS issue: https://github.com/Microsoft/TypeScript/issues/21592
            const entity = new this.translationCtor(input);
            if (counterpart) {
                entity.id = counterpart.id;
                entity.base = counterpart.base;
            }
            return entity;
        });
    }
}
exports.TranslationDiffer = TranslationDiffer;
//# sourceMappingURL=translation-differ.js.map