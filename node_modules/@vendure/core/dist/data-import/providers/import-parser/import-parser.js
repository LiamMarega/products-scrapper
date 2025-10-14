"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportParser = void 0;
const common_1 = require("@nestjs/common");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const normalize_string_1 = require("@vendure/common/lib/normalize-string");
const unique_1 = require("@vendure/common/lib/unique");
const csv_parse_1 = require("csv-parse");
const errors_1 = require("../../../common/error/errors");
const config_service_1 = require("../../../config/config.service");
const baseTranslatableColumns = [
    'name',
    'slug',
    'description',
    'facets',
    'optionGroups',
    'optionValues',
    'variantFacets',
];
const requiredColumns = [
    'name',
    'slug',
    'description',
    'assets',
    'facets',
    'optionGroups',
    'optionValues',
    'sku',
    'price',
    'taxCategory',
    'variantAssets',
    'variantFacets',
];
/**
 * @description
 * Validates and parses CSV files into a data structure which can then be used to created new entities.
 * This is used internally by the {@link Importer}.
 *
 * @docsCategory import-export
 * @docsPage ImportParser
 * @docsWeight 0
 */
let ImportParser = class ImportParser {
    /** @internal */
    constructor(configService) {
        this.configService = configService;
    }
    /**
     * @description
     * Parses the contents of the [product import CSV file](/guides/developer-guide/importing-data/#product-import-format) and
     * returns a data structure which can then be used to populate Vendure using the {@link FastImporterService}.
     */
    async parseProducts(input, mainLanguage = this.configService.defaultLanguageCode) {
        const options = {
            trim: true,
            relax_column_count: true,
        };
        return new Promise((resolve, reject) => {
            let errors = [];
            if (typeof input === 'string') {
                (0, csv_parse_1.parse)(input, options, (err, records) => {
                    if (err) {
                        errors = errors.concat(err);
                    }
                    if (records) {
                        const parseResult = this.processRawRecords(records, mainLanguage);
                        errors = errors.concat(parseResult.errors);
                        resolve({ results: parseResult.results, errors, processed: parseResult.processed });
                    }
                    else {
                        resolve({ results: [], errors, processed: 0 });
                    }
                });
            }
            else {
                const parser = (0, csv_parse_1.parse)(options);
                const records = [];
                // input.on('open', () => input.pipe(parser));
                input.pipe(parser);
                parser.on('readable', () => {
                    let record;
                    // eslint-disable-next-line no-cond-assign
                    while ((record = parser.read())) {
                        records.push(record);
                    }
                });
                parser.on('error', reject);
                parser.on('end', () => {
                    const parseResult = this.processRawRecords(records, mainLanguage);
                    errors = errors.concat(parseResult.errors);
                    resolve({ results: parseResult.results, errors, processed: parseResult.processed });
                });
            }
        });
    }
    processRawRecords(records, mainLanguage) {
        const results = [];
        const errors = [];
        let currentRow;
        const headerRow = records[0];
        const rest = records.slice(1);
        const totalProducts = rest.map(row => row[0]).filter(name => name.trim() !== '').length;
        const customFieldErrors = this.validateCustomFields(headerRow);
        if (customFieldErrors.length > 0) {
            return { results: [], errors: customFieldErrors, processed: 0 };
        }
        const translationError = this.validateHeaderTranslations(headerRow);
        if (translationError) {
            return { results: [], errors: [translationError], processed: 0 };
        }
        const columnError = validateRequiredColumns(headerRow);
        if (columnError) {
            return { results: [], errors: [columnError], processed: 0 };
        }
        const usedLanguages = usedLanguageCodes(headerRow);
        let line = 1;
        for (const record of rest) {
            line++;
            const columnCountError = validateColumnCount(headerRow, record);
            if (columnCountError) {
                errors.push(columnCountError + ` on line ${line}`);
                continue;
            }
            const r = mapRowToObject(headerRow, record);
            if (getRawMainTranslation(r, 'name', mainLanguage)) {
                if (currentRow) {
                    populateOptionGroupValues(currentRow);
                    results.push(currentRow);
                }
                currentRow = {
                    product: this.parseProductFromRecord(r, usedLanguages, mainLanguage),
                    variants: [this.parseVariantFromRecord(r, usedLanguages, mainLanguage)],
                };
            }
            else {
                if (currentRow) {
                    currentRow.variants.push(this.parseVariantFromRecord(r, usedLanguages, mainLanguage));
                }
            }
            const optionError = validateOptionValueCount(r, currentRow);
            if (optionError) {
                errors.push(optionError + ` on line ${line}`);
            }
        }
        if (currentRow) {
            populateOptionGroupValues(currentRow);
            results.push(currentRow);
        }
        return { results, errors, processed: totalProducts };
    }
    validateCustomFields(rowKeys) {
        const errors = [];
        for (const rowKey of rowKeys) {
            const baseKey = getBaseKey(rowKey);
            const parts = baseKey.split(':');
            if (parts.length === 1) {
                continue;
            }
            if (parts.length === 2) {
                let customFieldConfigs = [];
                if (parts[0] === 'product') {
                    customFieldConfigs = this.configService.customFields.Product;
                }
                else if (parts[0] === 'variant') {
                    customFieldConfigs = this.configService.customFields.ProductVariant;
                }
                else {
                    continue;
                }
                const customFieldConfig = customFieldConfigs.find(config => config.name === parts[1]);
                if (customFieldConfig) {
                    continue;
                }
            }
            errors.push(`Invalid custom field: ${rowKey}`);
        }
        return errors;
    }
    isTranslatable(baseKey) {
        const parts = baseKey.split(':');
        if (parts.length === 1) {
            return baseTranslatableColumns.includes(baseKey);
        }
        if (parts.length === 2) {
            let customFieldConfigs;
            if (parts[0] === 'product') {
                customFieldConfigs = this.configService.customFields.Product;
            }
            else if (parts[0] === 'variant') {
                customFieldConfigs = this.configService.customFields.ProductVariant;
            }
            else {
                throw new errors_1.InternalServerError(`Invalid column header '${baseKey}'`);
            }
            const customFieldConfig = customFieldConfigs.find(config => config.name === parts[1]);
            if (!customFieldConfig) {
                throw new errors_1.InternalServerError(`Could not find custom field config for column header '${baseKey}'`);
            }
            return customFieldConfig.type === 'localeString';
        }
        throw new errors_1.InternalServerError(`Invalid column header '${baseKey}'`);
    }
    validateHeaderTranslations(rowKeys) {
        const missing = [];
        const languageCodes = usedLanguageCodes(rowKeys);
        const baseKeys = usedBaseKeys(rowKeys);
        for (const baseKey of baseKeys) {
            const translatedKeys = languageCodes.map(code => [baseKey, code].join(':'));
            if (rowKeys.includes(baseKey)) {
                // Untranslated column header is used -> there should be no translated ones
                if (rowKeys.some(key => translatedKeys.includes(key))) {
                    return `The import file must not contain both translated and untranslated columns for field '${baseKey}'`;
                }
            }
            else {
                if (!this.isTranslatable(baseKey) && translatedKeys.some(key => rowKeys.includes(key))) {
                    return `The '${baseKey}' field is not translatable.`;
                }
                // All column headers must exist for all translations
                for (const translatedKey of translatedKeys) {
                    if (!rowKeys.includes(translatedKey)) {
                        missing.push(translatedKey);
                    }
                }
            }
        }
        if (missing.length) {
            return `The import file is missing the following translations: ${missing
                .map(m => `"${m}"`)
                .join(', ')}`;
        }
    }
    parseProductFromRecord(r, usedLanguages, mainLanguage) {
        const translationCodes = usedLanguages.length === 0 ? [mainLanguage] : usedLanguages;
        const optionGroups = [];
        for (const languageCode of translationCodes) {
            const rawTranslOptionGroups = r.hasOwnProperty(`optionGroups:${languageCode}`)
                ? r[`optionGroups:${languageCode}`]
                : r.optionGroups;
            const translatedOptionGroups = parseStringArray(rawTranslOptionGroups);
            if (optionGroups.length === 0) {
                for (const translatedOptionGroup of translatedOptionGroups) {
                    optionGroups.push({ translations: [] });
                }
            }
            for (const i of optionGroups.map((optionGroup, index) => index)) {
                optionGroups[i].translations.push({
                    languageCode,
                    name: translatedOptionGroups[i],
                    values: [],
                });
            }
        }
        const facets = [];
        for (const languageCode of translationCodes) {
            const rawTranslatedFacets = r.hasOwnProperty(`facets:${languageCode}`)
                ? r[`facets:${languageCode}`]
                : r.facets;
            const translatedFacets = parseStringArray(rawTranslatedFacets);
            if (facets.length === 0) {
                for (const translatedFacet of translatedFacets) {
                    facets.push({ translations: [] });
                }
            }
            for (const i of facets.map((facet, index) => index)) {
                const [facet, value] = translatedFacets[i].split(':');
                facets[i].translations.push({
                    languageCode,
                    facet,
                    value,
                });
            }
        }
        const translations = translationCodes.map(languageCode => {
            const translatedFields = getRawTranslatedFields(r, languageCode);
            const parsedTranslatedCustomFields = parseCustomFields('product', translatedFields);
            const parsedUntranslatedCustomFields = parseCustomFields('product', getRawUntranslatedFields(r));
            const parsedCustomFields = Object.assign(Object.assign({}, parsedUntranslatedCustomFields), parsedTranslatedCustomFields);
            const name = translatedFields.hasOwnProperty('name')
                ? parseString(translatedFields.name)
                : r.name;
            let slug;
            if (translatedFields.hasOwnProperty('slug')) {
                slug = parseString(translatedFields.slug);
            }
            else {
                slug = parseString(r.slug);
            }
            if (slug.length === 0) {
                slug = (0, normalize_string_1.normalizeString)(name, '-');
            }
            return {
                languageCode,
                name,
                slug,
                description: translatedFields.hasOwnProperty('description')
                    ? parseString(translatedFields.description)
                    : r.description,
                customFields: parsedCustomFields,
            };
        });
        const parsedProduct = {
            assetPaths: parseStringArray(r.assets),
            optionGroups,
            facets,
            translations,
        };
        return parsedProduct;
    }
    parseVariantFromRecord(r, usedLanguages, mainLanguage) {
        const translationCodes = usedLanguages.length === 0 ? [mainLanguage] : usedLanguages;
        const facets = [];
        for (const languageCode of translationCodes) {
            const rawTranslatedFacets = r.hasOwnProperty(`variantFacets:${languageCode}`)
                ? r[`variantFacets:${languageCode}`]
                : r.variantFacets;
            const translatedFacets = parseStringArray(rawTranslatedFacets);
            if (facets.length === 0) {
                for (const translatedFacet of translatedFacets) {
                    facets.push({ translations: [] });
                }
            }
            for (const i of facets.map((facet, index) => index)) {
                const [facet, value] = translatedFacets[i].split(':');
                facets[i].translations.push({
                    languageCode,
                    facet,
                    value,
                });
            }
        }
        const translations = translationCodes.map(languageCode => {
            const rawTranslOptionValues = r.hasOwnProperty(`optionValues:${languageCode}`)
                ? r[`optionValues:${languageCode}`]
                : r.optionValues;
            const translatedOptionValues = parseStringArray(rawTranslOptionValues);
            const translatedFields = getRawTranslatedFields(r, languageCode);
            const parsedTranslatedCustomFields = parseCustomFields('variant', translatedFields);
            const parsedUntranslatedCustomFields = parseCustomFields('variant', getRawUntranslatedFields(r));
            const parsedCustomFields = Object.assign(Object.assign({}, parsedUntranslatedCustomFields), parsedTranslatedCustomFields);
            return {
                languageCode,
                optionValues: translatedOptionValues,
                customFields: parsedCustomFields,
            };
        });
        const parsedVariant = {
            sku: parseString(r.sku),
            price: parseNumber(r.price),
            taxCategory: parseString(r.taxCategory),
            stockOnHand: parseNumber(r.stockOnHand),
            trackInventory: r.trackInventory == null || r.trackInventory === ''
                ? generated_types_1.GlobalFlag.INHERIT
                : parseBoolean(r.trackInventory)
                    ? generated_types_1.GlobalFlag.TRUE
                    : generated_types_1.GlobalFlag.FALSE,
            assetPaths: parseStringArray(r.variantAssets),
            facets,
            translations,
        };
        return parsedVariant;
    }
};
exports.ImportParser = ImportParser;
exports.ImportParser = ImportParser = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], ImportParser);
function populateOptionGroupValues(currentRow) {
    for (const translation of currentRow.product.translations) {
        const values = currentRow.variants.map(variant => {
            const variantTranslation = variant.translations.find(t => t.languageCode === translation.languageCode);
            if (!variantTranslation) {
                throw new errors_1.InternalServerError(`No translation '${translation.languageCode}' for variant SKU '${variant.sku}'`);
            }
            return variantTranslation.optionValues;
        });
        currentRow.product.optionGroups.forEach((og, i) => {
            const ogTranslation = og.translations.find(t => t.languageCode === translation.languageCode);
            if (!ogTranslation) {
                throw new errors_1.InternalServerError(`No translation '${translation.languageCode}' for option groups'`);
            }
            ogTranslation.values = (0, unique_1.unique)(values.map(v => v[i]));
        });
    }
}
function getLanguageCode(rowKey) {
    const parts = rowKey.split(':');
    if (parts.length === 2) {
        if (parts[1] in generated_types_1.LanguageCode) {
            return parts[1];
        }
    }
    if (parts.length === 3) {
        if (['product', 'productVariant'].includes(parts[0]) && parts[2] in generated_types_1.LanguageCode) {
            return parts[2];
        }
    }
}
function getBaseKey(rowKey) {
    const parts = rowKey.split(':');
    if (getLanguageCode(rowKey)) {
        parts.pop();
        return parts.join(':');
    }
    else {
        return rowKey;
    }
}
function usedLanguageCodes(rowKeys) {
    const languageCodes = [];
    for (const rowKey of rowKeys) {
        const languageCode = getLanguageCode(rowKey);
        if (languageCode && !languageCodes.includes(languageCode)) {
            languageCodes.push(languageCode);
        }
    }
    return languageCodes;
}
function usedBaseKeys(rowKeys) {
    const baseKeys = [];
    for (const rowKey of rowKeys) {
        const baseKey = getBaseKey(rowKey);
        if (!baseKeys.includes(baseKey)) {
            baseKeys.push(baseKey);
        }
    }
    return baseKeys;
}
function validateRequiredColumns(r) {
    const rowKeys = r;
    const missing = [];
    const languageCodes = usedLanguageCodes(rowKeys);
    for (const col of requiredColumns) {
        if (!rowKeys.includes(col)) {
            if (languageCodes.length > 0 && rowKeys.includes(`${col}:${languageCodes[0]}`)) {
                continue; // If one translation is present, they are all present (we did 'validateHeaderTranslations' before)
            }
            missing.push(col);
        }
    }
    if (missing.length) {
        return `The import file is missing the following columns: ${missing.map(m => `"${m}"`).join(', ')}`;
    }
}
function validateColumnCount(columns, row) {
    if (columns.length !== row.length) {
        return `Invalid Record Length: header length is ${columns.length}, got ${row.length}`;
    }
}
function mapRowToObject(columns, row) {
    return row.reduce((obj, val, i) => {
        return Object.assign(Object.assign({}, obj), { [columns[i]]: val });
    }, {});
}
function validateOptionValueCount(r, currentRow) {
    if (!currentRow) {
        return;
    }
    const optionValueKeys = Object.keys(r).filter(key => key.startsWith('optionValues'));
    for (const key of optionValueKeys) {
        const optionValues = parseStringArray(r[key]);
        if (currentRow.product.optionGroups.length !== optionValues.length) {
            return `The number of optionValues in column '${key}' must match the number of optionGroups`;
        }
    }
}
function getRawMainTranslation(r, field, mainLanguage) {
    if (r.hasOwnProperty(field)) {
        return r[field];
    }
    else {
        return r[`${field}:${mainLanguage}`];
    }
}
function getRawTranslatedFields(r, languageCode) {
    return Object.entries(r)
        .filter(([key, value]) => key.endsWith(`:${languageCode}`))
        .reduce((output, [key, value]) => {
        const fieldName = key.replace(`:${languageCode}`, '');
        return Object.assign(Object.assign({}, output), { [fieldName]: value });
    }, {});
}
function getRawUntranslatedFields(r) {
    return Object.entries(r)
        .filter(([key, value]) => {
        return !getLanguageCode(key);
    })
        .reduce((output, [key, value]) => {
        return Object.assign(Object.assign({}, output), { [key]: value });
    }, {});
}
function isRelationObject(value) {
    try {
        const parsed = JSON.parse(value);
        return parsed && parsed.hasOwnProperty('id');
    }
    catch (e) {
        return false;
    }
}
function parseCustomFields(prefix, r) {
    return Object.entries(r)
        .filter(([key, value]) => {
        return key.indexOf(`${prefix}:`) === 0;
    })
        .reduce((output, [key, value]) => {
        const fieldName = key.replace(`${prefix}:`, '');
        return Object.assign(Object.assign({}, output), { [fieldName]: isRelationObject(value) ? JSON.parse(value) : value });
    }, {});
}
function parseString(input) {
    return (input || '').trim();
}
function parseNumber(input) {
    return +(input || '').trim();
}
function parseBoolean(input) {
    if (input == null) {
        return false;
    }
    switch (input.toLowerCase()) {
        case 'true':
        case '1':
        case 'yes':
            return true;
        default:
            return false;
    }
}
function parseStringArray(input, separator = '|') {
    return (input || '')
        .trim()
        .split(separator)
        .map(s => s.trim())
        .filter(s => s !== '');
}
//# sourceMappingURL=import-parser.js.map