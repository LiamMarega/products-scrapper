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
exports.IdCodecService = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("../../config/config.service");
const id_codec_1 = require("./id-codec");
let IdCodecService = class IdCodecService {
    constructor(configService) {
        var _a;
        this.idCodec = new id_codec_1.IdCodec((_a = configService.entityOptions.entityIdStrategy) !== null && _a !== void 0 ? _a : configService.entityIdStrategy);
    }
    encode(target, transformKeys) {
        return this.idCodec.encode(target, transformKeys);
    }
    decode(target, transformKeys) {
        return this.idCodec.decode(target, transformKeys);
    }
};
exports.IdCodecService = IdCodecService;
exports.IdCodecService = IdCodecService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], IdCodecService);
//# sourceMappingURL=id-codec.service.js.map