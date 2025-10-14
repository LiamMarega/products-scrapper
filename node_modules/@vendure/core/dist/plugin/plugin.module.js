"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PluginModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginModule = void 0;
const common_1 = require("@nestjs/common");
const config_helpers_1 = require("../config/config-helpers");
const config_module_1 = require("../config/config.module");
/**
 * This module collects and re-exports all providers defined in plugins so that they can be used in other
 * modules.
 */
let PluginModule = PluginModule_1 = class PluginModule {
    static forRoot() {
        return {
            module: PluginModule_1,
            imports: [...(0, config_helpers_1.getConfig)().plugins],
        };
    }
};
exports.PluginModule = PluginModule;
exports.PluginModule = PluginModule = PluginModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [config_module_1.ConfigModule],
    })
], PluginModule);
//# sourceMappingURL=plugin.module.js.map