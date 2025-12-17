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
import { Controller, Headers, Post, Req } from '@nestjs/common';
import { WebhooksService } from '../webhooks/webhooks.service.js';
import Stripe from 'stripe';
let StripeController = class StripeController {
    constructor(webhooks) {
        this.webhooks = webhooks;
    }
    async webhook(req, signature) {
        const secret = process.env.STRIPE_SIGNING_SECRET;
        if (secret && signature) {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });
            try {
                const event = stripe.webhooks.constructEvent(req.body, signature, secret);
                await this.webhooks.enqueue({ source: 'stripe', payload: event });
                return { ok: true };
            }
            catch (_e) {
                return { ok: false };
            }
        }
        else {
            await this.webhooks.enqueue({ source: 'stripe', payload: req.body });
            return { ok: true };
        }
    }
};
__decorate([
    Post('webhook'),
    __param(0, Req()),
    __param(1, Headers('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "webhook", null);
StripeController = __decorate([
    Controller('stripe'),
    __metadata("design:paramtypes", [WebhooksService])
], StripeController);
export { StripeController };
//# sourceMappingURL=stripe.controller.js.map