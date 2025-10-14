import { ColumnOptions } from 'typeorm';
import { MoneyStrategy } from './money-strategy';
/**
 * @description
 * A {@link MoneyStrategy} that stores monetary values as a `int` type in the database.
 * The storage configuration and rounding logic replicates the behaviour of Vendure pre-2.0.
 *
 * @docsCategory money
 * @since 2.0.0
 */
export declare class DefaultMoneyStrategy implements MoneyStrategy {
    readonly moneyColumnOptions: ColumnOptions;
    readonly precision: number;
    round(value: number, quantity?: number): number;
}
