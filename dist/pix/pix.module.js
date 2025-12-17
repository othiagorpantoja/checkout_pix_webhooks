var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { PixController } from './pix.controller.js';
import { PixService } from './pix.service.js';
import { ConfigModule } from '../config/config.module.js';
import { WebhooksModule } from '../webhooks/webhooks.module.js';
let PixModule = class PixModule {
};
PixModule = __decorate([
    Module({
        imports: [ConfigModule, WebhooksModule],
        controllers: [PixController],
        providers: [PixService]
    })
], PixModule);
export { PixModule };
//# sourceMappingURL=pix.module.js.map