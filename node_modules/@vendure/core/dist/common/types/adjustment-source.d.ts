import { Adjustment, AdjustmentType } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { VendureEntity } from '../../entity/base/base.entity';
export type TestResult = boolean | object;
export declare abstract class AdjustmentSource extends VendureEntity {
    type: AdjustmentType;
    getSourceId(): string;
    static decodeSourceId(sourceId: string): {
        type: AdjustmentType;
        id: ID;
    };
    abstract test(...args: any[]): TestResult | Promise<TestResult>;
    abstract apply(...args: any[]): Adjustment | undefined | Promise<Adjustment | undefined>;
}
