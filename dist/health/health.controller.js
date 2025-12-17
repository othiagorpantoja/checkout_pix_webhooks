var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Get } from '@nestjs/common';
import { WebhooksService } from '../webhooks/webhooks.service.js';
let HealthController = class HealthController {
    constructor(webhooks) {
        this.webhooks = webhooks;
    }
    async get() {
        const targets = this.webhooks.list();
        const queue = this.webhooks.queue;
        let queueStats = {};
        if (queue && 'stats' in queue && typeof queue.stats === 'function') {
            queueStats = queue.stats();
        }
        else if (queue && 'ping' in queue && typeof queue.ping === 'function') {
            queueStats = await queue.ping();
        }
        return {
            ok: true,
            targets: targets.length,
            queue: queueStats
        };
    }
    async live() {
        return { ok: true };
    }
    async ready() {
        const queue = this.webhooks.queue;
        let queueStats = {};
        if (queue && 'ping' in queue && typeof queue.ping === 'function') {
            queueStats = await queue.ping();
        }
        return { ok: true, queue: queueStats };
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "get", null);
__decorate([
    Get('live'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "live", null);
__decorate([
    Get('ready'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "ready", null);
HealthController = __decorate([
    Controller('health'),
    __metadata("design:paramtypes", [WebhooksService])
], HealthController);
export { HealthController };
//# sourceMappingURL=health.controller.js.map