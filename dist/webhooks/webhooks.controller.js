var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { WebhooksService } from './webhooks.service.js';
class RegisterWebhookDto {
}
__decorate([
    IsUrl(),
    __metadata("design:type", String)
], RegisterWebhookDto.prototype, "url", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], RegisterWebhookDto.prototype, "secret", void 0);
let WebhooksController = class WebhooksController {
    constructor(webhooks) {
        this.webhooks = webhooks;
    }
    async register(dto) {
        return this.webhooks.register(dto.url, dto.secret);
    }
    list() {
        return this.webhooks.list();
    }
    async remove(dto) {
        return this.webhooks.remove(dto.url);
    }
};
__decorate([
    Post('register'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterWebhookDto]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "register", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "list", null);
__decorate([
    Delete('register'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterWebhookDto]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "remove", null);
WebhooksController = __decorate([
    Controller('webhooks'),
    __metadata("design:paramtypes", [WebhooksService])
], WebhooksController);
export { WebhooksController };
//# sourceMappingURL=webhooks.controller.js.map