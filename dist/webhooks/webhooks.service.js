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
import { Injectable, Optional } from '@nestjs/common';
import { SqsQueue } from '../common/queue/sqs-queue.js';
import { InMemoryQueue } from '../common/queue/inmemory-queue.js';
import axios from 'axios';
import crypto from 'node:crypto';
import { MetricsService } from '../metrics/metrics.service.js';
import { FileTargetsStorage } from './storage/file-storage.js';
import { MemoryTargetsStorage } from './storage/memory-storage.js';
import { DbTargetsStorage } from './storage/db-storage.js';
let WebhooksService = class WebhooksService {
    constructor(metrics) {
        this.metrics = metrics;
        this.targets = [];
        if (process.env.AWS_SQS_QUEUE_URL) {
            this.queue = new SqsQueue({
                queueUrl: process.env.AWS_SQS_QUEUE_URL,
                dlqUrl: process.env.AWS_SQS_DLQ_URL,
                region: process.env.AWS_REGION || 'us-east-1'
            });
        }
        else {
            this.queue = new InMemoryQueue();
        }
        const storageMode = process.env.WEBHOOK_TARGETS_STORAGE || 'memory';
        const storagePath = process.env.WEBHOOK_TARGETS_PATH;
        this.storage =
            storageMode === 'file'
                ? new FileTargetsStorage(storagePath)
                : storageMode === 'db'
                    ? new DbTargetsStorage()
                    : new MemoryTargetsStorage();
        this.storage.load().then(items => {
            if (Array.isArray(items) && items.length)
                this.targets = items;
        });
        const preset = process.env.WEBHOOK_DEFAULT_TARGETS;
        if (preset) {
            try {
                const items = JSON.parse(preset);
                if (Array.isArray(items)) {
                    for (const i of items) {
                        if (i && typeof i.url === 'string')
                            this.targets.push({ url: i.url, secret: i.secret });
                    }
                    this.storage.save(this.targets);
                }
            }
            catch { }
        }
        this.consume();
    }
    async register(url, secret) {
        this.targets.push({ url, secret });
        await this.storage.save(this.targets);
        return { url };
    }
    list() {
        return this.targets;
    }
    async remove(url) {
        this.targets = this.targets.filter(t => t.url !== url);
        await this.storage.save(this.targets);
        return { ok: true };
    }
    async enqueue(event) {
        await this.queue.push(JSON.stringify(event));
        if (this.metrics)
            this.metrics.enqueuedTotal.inc();
    }
    consume() {
        this.queue.consume(async (msg) => {
            const event = JSON.parse(msg);
            for (const t of this.targets) {
                const headers = {};
                if (t.secret) {
                    const h = crypto.createHmac('sha256', t.secret);
                    h.update(JSON.stringify(event));
                    headers['x-webhook-signature'] = h.digest('hex');
                }
                try {
                    await axios.post(t.url, event, { headers, timeout: 10000 });
                    if (this.metrics)
                        this.metrics.deliveriesTotal.inc();
                }
                catch (e) {
                    if (this.metrics)
                        this.metrics.deliveryErrorsTotal.inc();
                    throw e;
                }
            }
        });
    }
    async onModuleDestroy() {
        if ('stop' in this.queue && typeof this.queue.stop === 'function') {
            ;
            this.queue.stop();
        }
    }
};
WebhooksService = __decorate([
    Injectable(),
    __param(0, Optional()),
    __metadata("design:paramtypes", [MetricsService])
], WebhooksService);
export { WebhooksService };
//# sourceMappingURL=webhooks.service.js.map