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
exports.AnonymousSession = void 0;
const typeorm_1 = require("typeorm");
const session_entity_1 = require("./session.entity");
/**
 * @description
 * An anonymous session is created when a unauthenticated user interacts with restricted operations,
 * such as calling the `activeOrder` query in the Shop API. Anonymous sessions allow a guest Customer
 * to maintain an order without requiring authentication and a registered account beforehand.
 *
 * @docsCategory entities
 */
let AnonymousSession = class AnonymousSession extends session_entity_1.Session {
    constructor(input) {
        super(input);
    }
};
exports.AnonymousSession = AnonymousSession;
exports.AnonymousSession = AnonymousSession = __decorate([
    (0, typeorm_1.ChildEntity)(),
    __metadata("design:paramtypes", [Object])
], AnonymousSession);
//# sourceMappingURL=anonymous-session.entity.js.map