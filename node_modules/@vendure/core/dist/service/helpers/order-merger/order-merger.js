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
exports.OrderMerger = void 0;
const common_1 = require("@nestjs/common");
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const utils_1 = require("../../../common/utils");
const config_service_1 = require("../../../config/config.service");
let OrderMerger = class OrderMerger {
    constructor(configService) {
        this.configService = configService;
    }
    /**
     * Applies the configured OrderMergeStrategy to the supplied guestOrder and existingOrder. Returns an object
     * containing entities which then need to be persisted to the database by the OrderService methods.
     */
    merge(ctx, guestOrder, existingOrder) {
        if (guestOrder && !this.orderEmpty(guestOrder) && existingOrder && !this.orderEmpty(existingOrder)) {
            const { mergeStrategy } = this.configService.orderOptions;
            const mergedLines = mergeStrategy.merge(ctx, guestOrder, existingOrder);
            return {
                order: existingOrder,
                linesToInsert: this.getLinesToInsert(guestOrder, existingOrder, mergedLines),
                linesToModify: this.getLinesToModify(guestOrder, existingOrder, mergedLines),
                linesToDelete: this.getLinesToDelete(guestOrder, existingOrder, mergedLines),
                orderToDelete: guestOrder,
            };
        }
        else if (guestOrder &&
            !this.orderEmpty(guestOrder) &&
            (!existingOrder || (existingOrder && this.orderEmpty(existingOrder)))) {
            return {
                order: guestOrder,
                orderToDelete: existingOrder,
            };
        }
        else {
            return {
                order: existingOrder,
                orderToDelete: guestOrder,
            };
        }
    }
    getLinesToInsert(guestOrder, existingOrder, mergedLines) {
        return guestOrder.lines
            .map(guestLine => {
            const mergedLine = mergedLines.find(ml => (0, utils_1.idsAreEqual)(ml.orderLineId, guestLine.id));
            if (!mergedLine) {
                return;
            }
            return {
                productVariantId: guestLine.productVariant.id,
                quantity: mergedLine.quantity,
                customFields: mergedLine.customFields,
            };
        })
            .filter(shared_utils_1.notNullOrUndefined);
    }
    getLinesToModify(guestOrder, existingOrder, mergedLines) {
        return existingOrder.lines
            .map(existingLine => {
            const mergedLine = mergedLines.find(ml => (0, utils_1.idsAreEqual)(ml.orderLineId, existingLine.id));
            if (!mergedLine) {
                return;
            }
            const lineIsModified = mergedLine.quantity !== existingLine.quantity ||
                JSON.stringify(mergedLine.customFields) !== JSON.stringify(existingLine.customFields);
            if (!lineIsModified) {
                return;
            }
            return {
                orderLineId: mergedLine.orderLineId,
                quantity: mergedLine.quantity,
                customFields: mergedLine.customFields,
            };
        })
            .filter(shared_utils_1.notNullOrUndefined);
    }
    getLinesToDelete(guestOrder, existingOrder, mergedLines) {
        return existingOrder.lines
            .filter(existingLine => !mergedLines.find(ml => (0, utils_1.idsAreEqual)(ml.orderLineId, existingLine.id)))
            .map(existingLine => ({ orderLineId: existingLine.id }));
    }
    orderEmpty(order) {
        return !order || !order.lines || !order.lines.length;
    }
};
exports.OrderMerger = OrderMerger;
exports.OrderMerger = OrderMerger = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], OrderMerger);
//# sourceMappingURL=order-merger.js.map