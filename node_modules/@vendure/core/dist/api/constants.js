"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VENDURE_ADMIN_API_TYPE_PATHS = exports.VENDURE_SHOP_API_TYPE_PATHS = void 0;
const path_1 = __importDefault(require("path"));
exports.VENDURE_SHOP_API_TYPE_PATHS = ['shop-api', 'common'].map(p => path_1.default.join(__dirname, 'schema', p, '*.graphql'));
exports.VENDURE_ADMIN_API_TYPE_PATHS = ['admin-api', 'common'].map(p => path_1.default.join(__dirname, 'schema', p, '*.graphql'));
//# sourceMappingURL=constants.js.map