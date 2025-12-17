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
import { collectDefaultMetrics, Counter, Gauge, register } from 'prom-client';
let MetricsService = class MetricsService {
    constructor() {
        collectDefaultMetrics();
        this.deliveriesTotal = new Counter({ name: 'webhook_deliveries_total', help: 'Total de entregas de webhooks' });
        this.deliveryErrorsTotal = new Counter({ name: 'webhook_delivery_errors_total', help: 'Total de erros de entrega' });
        this.enqueuedTotal = new Counter({ name: 'webhook_enqueued_total', help: 'Total de eventos enfileirados' });
        this.dlqTotal = new Gauge({ name: 'webhook_dlq_total', help: 'Mensagens na DLQ (estimado)' });
    }
    async metrics() {
        return register.metrics();
    }
};
MetricsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], MetricsService);
export { MetricsService };
//# sourceMappingURL=metrics.service.js.map