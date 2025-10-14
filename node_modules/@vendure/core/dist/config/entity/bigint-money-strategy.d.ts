import { ColumnOptions } from 'typeorm';
import { MoneyStrategy } from './money-strategy';
/**
 * @description
 * A {@link MoneyStrategy} that stores monetary values as a `bigint` type in the database, which
 * allows values up to ~9 quadrillion to be stored (limited by JavaScript's `MAX_SAFE_INTEGER` limit).
 *
 * This strategy also slightly differs in the way rounding is performed, with rounding being done _after_
 * multiplying the unit price, rather than before (as is the case with the {@link DefaultMoneyStrategy}.
 *
 * @docsCategory money
 * @since 2.0.0
 */
export declare class BigIntMoneyStrategy implements MoneyStrategy {
    readonly moneyColumnOptions: ColumnOptions;
    precision: number;
    round(value: number, quantity?: number): number;
}
