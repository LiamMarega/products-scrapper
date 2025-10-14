"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEntityDuplicators = void 0;
const collection_duplicator_1 = require("./collection-duplicator");
const facet_duplicator_1 = require("./facet-duplicator");
const product_duplicator_1 = require("./product-duplicator");
const promotion_duplicator_1 = require("./promotion-duplicator");
exports.defaultEntityDuplicators = [
    product_duplicator_1.productDuplicator,
    collection_duplicator_1.collectionDuplicator,
    facet_duplicator_1.facetDuplicator,
    promotion_duplicator_1.promotionDuplicator,
];
//# sourceMappingURL=index.js.map