import { Type } from '@vendure/common/lib/shared-types';
import { CalculatedColumnDefinition } from '../../../common/calculated-decorator';
/**
 * @description
 * Returns calculated columns definitions for the given entity type.
 */
export declare function getCalculatedColumns(entity: Type<any>): CalculatedColumnDefinition[];
