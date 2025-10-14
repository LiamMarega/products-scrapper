"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerHealthService = void 0;
const common_1 = require("@nestjs/common");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const vendure_logger_1 = require("../config/logger/vendure-logger");
let WorkerHealthService = class WorkerHealthService {
    initializeHealthCheckEndpoint(config) {
        const { port, hostname, route } = config;
        const healthRoute = route || '/health';
        const app = (0, express_1.default)();
        const server = http_1.default.createServer(app);
        app.get(healthRoute, (req, res) => {
            res.send({
                status: 'ok',
            });
        });
        this.server = server;
        return new Promise((resolve, reject) => {
            server.on('error', err => {
                vendure_logger_1.Logger.error(`Failed to start worker health endpoint server (${err.toString()})`);
                reject(err);
            });
            server.on('listening', () => {
                const endpointUrl = `http://${hostname || 'localhost'}:${port}${healthRoute}`;
                vendure_logger_1.Logger.info(`Worker health check endpoint: ${endpointUrl}`);
                resolve();
            });
            server.listen(port, hostname || '');
        });
    }
    onModuleDestroy() {
        return new Promise(resolve => {
            if (this.server) {
                this.server.close(() => resolve());
            }
            else {
                resolve();
            }
        });
    }
};
exports.WorkerHealthService = WorkerHealthService;
exports.WorkerHealthService = WorkerHealthService = __decorate([
    (0, common_1.Injectable)()
], WorkerHealthService);
//# sourceMappingURL=worker-health.service.js.map