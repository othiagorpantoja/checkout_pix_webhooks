var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { MockPixProvider } from './providers/mock-pix.provider.js';
import { WebhooksService } from '../webhooks/webhooks.service.js';
let PixService = class PixService {
    constructor(webhooks) {
        this.webhooks = webhooks;
        this.provider = new MockPixProvider();
    }
    async createCharge(amount, description) {
        const charge = await this.provider.createCharge(amount, description);
        return charge;
    }
    async getCharge(id) {
        return this.provider.getCharge(id);
    }
    async handleWebhook(payload) {
        await this.webhooks.enqueue({ source: 'pix', payload });
    }
};
PixService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [WebhooksService])
], PixService);
export { PixService };
//# sourceMappingURL=pix.service.js.map