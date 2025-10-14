"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockStatusExtension = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.stockStatusExtension = (0, graphql_tag_1.default) `
    extend type SearchResult {
        inStock: Boolean!
    }

    extend input SearchInput {
        inStock: Boolean
    }
`;
//# sourceMappingURL=api-extensions.js.map