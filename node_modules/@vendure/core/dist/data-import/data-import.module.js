"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataImportModule = void 0;
const common_1 = require("@nestjs/common");
const config_module_1 = require("../config/config.module");
const connection_module_1 = require("../connection/connection.module");
const plugin_module_1 = require("../plugin/plugin.module");
const service_module_1 = require("../service/service.module");
const asset_importer_1 = require("./providers/asset-importer/asset-importer");
const import_parser_1 = require("./providers/import-parser/import-parser");
const fast_importer_service_1 = require("./providers/importer/fast-importer.service");
const importer_1 = require("./providers/importer/importer");
const populator_1 = require("./providers/populator/populator");
let DataImportModule = class DataImportModule {
};
exports.DataImportModule = DataImportModule;
exports.DataImportModule = DataImportModule = __decorate([
    (0, common_1.Module)({
        // Important! PluginModule must be defined before ServiceModule
        // in order that overrides of Services (e.g. SearchService) are correctly
        // registered with the injector.
        imports: [plugin_module_1.PluginModule.forRoot(), service_module_1.ServiceModule, connection_module_1.ConnectionModule.forPlugin(), config_module_1.ConfigModule],
        exports: [import_parser_1.ImportParser, importer_1.Importer, populator_1.Populator, fast_importer_service_1.FastImporterService, asset_importer_1.AssetImporter],
        providers: [import_parser_1.ImportParser, importer_1.Importer, populator_1.Populator, fast_importer_service_1.FastImporterService, asset_importer_1.AssetImporter],
    })
], DataImportModule);
//# sourceMappingURL=data-import.module.js.map