import { SearchInput } from '@vendure/common/lib/generated-types';
import { RequestContext } from '../../api/common/request-context';
import { VendureEvent } from '../vendure-event';
type ExtendedSearchInput = SearchInput & {
    [extendedInputField: string]: any;
};
/**
 * @description
 * This event is fired whenever a search query is executed.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.6.0
 */
export declare class SearchEvent extends VendureEvent {
    ctx: RequestContext;
    input: ExtendedSearchInput;
    constructor(ctx: RequestContext, input: ExtendedSearchInput);
}
export {};
