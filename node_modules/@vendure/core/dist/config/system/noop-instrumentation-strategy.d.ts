import { InstrumentationStrategy } from './instrumentation-strategy';
export declare class NoopInstrumentationStrategy implements InstrumentationStrategy {
    wrapMethod(): Promise<void>;
}
