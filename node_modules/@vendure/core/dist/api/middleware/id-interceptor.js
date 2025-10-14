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
exports.IdInterceptor = exports.ID_CODEC_TRANSFORM_KEYS = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const graphql_value_transformer_1 = require("../common/graphql-value-transformer");
const id_codec_service_1 = require("../common/id-codec.service");
const parse_context_1 = require("../common/parse-context");
exports.ID_CODEC_TRANSFORM_KEYS = 'idCodecTransformKeys';
/**
 * This interceptor automatically decodes incoming requests so that any
 * ID values are transformed correctly as per the configured EntityIdStrategy.
 *
 * ID values are defined as properties with the name "id", or properties with names matching any
 * arguments passed to the {@link Decode} decorator.
 */
let IdInterceptor = class IdInterceptor {
    constructor(idCodecService) {
        this.idCodecService = idCodecService;
        this.graphQlValueTransformers = new WeakMap();
    }
    intercept(context, next) {
        const { isGraphQL, req, info } = (0, parse_context_1.parseContext)(context);
        if (isGraphQL && info) {
            const args = graphql_1.GqlExecutionContext.create(context).getArgs();
            const transformer = this.getTransformerForSchema(info.schema);
            this.decodeIdArguments(transformer, info.operation, args);
        }
        return next.handle();
    }
    getTransformerForSchema(schema) {
        const existing = this.graphQlValueTransformers.get(schema);
        if (existing) {
            return existing;
        }
        const transformer = new graphql_value_transformer_1.GraphqlValueTransformer(schema);
        this.graphQlValueTransformers.set(schema, transformer);
        return transformer;
    }
    decodeIdArguments(graphqlValueTransformer, definition, variables = {}) {
        const typeTree = graphqlValueTransformer.getInputTypeTree(definition);
        graphqlValueTransformer.transformValues(typeTree, variables, (value, type) => {
            if ((type === null || type === void 0 ? void 0 : type.name) === 'ID') {
                return this.idCodecService.decode(value);
            }
            if ((type === null || type === void 0 ? void 0 : type.name) === 'IDOperators') {
                const keys = ['eq', 'notEq', 'in', 'notIn'];
                return this.idCodecService.decode(value, keys);
            }
            return value;
        });
        return variables;
    }
};
exports.IdInterceptor = IdInterceptor;
exports.IdInterceptor = IdInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [id_codec_service_1.IdCodecService])
], IdInterceptor);
//# sourceMappingURL=id-interceptor.js.map