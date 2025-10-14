"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjustmentSource = void 0;
const base_entity_1 = require("../../entity/base/base.entity");
class AdjustmentSource extends base_entity_1.VendureEntity {
    getSourceId() {
        return `${this.type}:${this.id}`;
    }
    static decodeSourceId(sourceId) {
        const [type, id] = sourceId.split(':');
        return {
            type: type,
            id: Number.isNaN(+id) ? id : +id,
        };
    }
}
exports.AdjustmentSource = AdjustmentSource;
//# sourceMappingURL=adjustment-source.js.map