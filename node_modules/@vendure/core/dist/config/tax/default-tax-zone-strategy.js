"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTaxZoneStrategy = void 0;
/**
 * @description
 * A default method of determining Zone for tax calculations. The strategy simply returns the default
 * tax zone of the Channel. In many cases you actually want to base the tax zone
 * on the shipping or billing address of the Order, in which case you would use the
 * {@link AddressBasedTaxZoneStrategy}.
 *
 * @docsCategory tax
 */
class DefaultTaxZoneStrategy {
    determineTaxZone(ctx, zones, channel, order) {
        return channel.defaultTaxZone;
    }
}
exports.DefaultTaxZoneStrategy = DefaultTaxZoneStrategy;
//# sourceMappingURL=default-tax-zone-strategy.js.map