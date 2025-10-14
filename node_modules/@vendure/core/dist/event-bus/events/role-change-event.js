"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleChangeEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever one {@link Role} is assigned or removed from a user.
 * The property `roleIds` only contains the removed or assigned role ids.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class RoleChangeEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, admin, roleIds, type) {
        super();
        this.ctx = ctx;
        this.admin = admin;
        this.roleIds = roleIds;
        this.type = type;
    }
}
exports.RoleChangeEvent = RoleChangeEvent;
//# sourceMappingURL=role-change-event.js.map