import { INestApplicationContext } from '@nestjs/common';
export declare function populate<T extends INestApplicationContext>(bootstrapFn: () => Promise<T | undefined>, initialDataPathOrObject: string | object, productsCsvPath?: string, channelOrToken?: string | import('@vendure/core').Channel): Promise<T>;
export declare function populateInitialData(app: INestApplicationContext, initialData: import('@vendure/core').InitialData, channel?: import('@vendure/core').Channel): Promise<void>;
export declare function populateCollections(app: INestApplicationContext, initialData: import('@vendure/core').InitialData, channel?: import('@vendure/core').Channel): Promise<void>;
export declare function importProductsFromCsv(app: INestApplicationContext, productsCsvPath: string, languageCode: import('@vendure/core').LanguageCode, channel?: import('@vendure/core').Channel): Promise<import('@vendure/core').ImportProgress>;
