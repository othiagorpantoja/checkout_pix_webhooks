import { Injectable, Optional } from '@nestjs/common'
import { SqsQueue } from '../common/queue/sqs-queue.js'
import { InMemoryQueue } from '../common/queue/inmemory-queue.js'
import axios from 'axios'
import crypto from 'node:crypto'
import { MetricsService } from '../metrics/metrics.service.js'
import { TargetsStorage, Target } from './storage/targets-storage.interface.js'
import { FileTargetsStorage } from './storage/file-storage.js'
import { MemoryTargetsStorage } from './storage/memory-storage.js'
import { DbTargetsStorage } from './storage/db-storage.js'

type WebhookEvent = { source: string; payload: any }

@Injectable()
export class WebhooksService {
  private queue: SqsQueue | InMemoryQueue
  private targets: Target[] = []
  private storage: TargetsStorage

  constructor(@Optional() private readonly metrics?: MetricsService) {
    if (process.env.AWS_SQS_QUEUE_URL) {
      this.queue = new SqsQueue({
        queueUrl: process.env.AWS_SQS_QUEUE_URL,
        dlqUrl: process.env.AWS_SQS_DLQ_URL,
        region: process.env.AWS_REGION || 'us-east-1'
      })
    } else {
      this.queue = new InMemoryQueue()
    }
    const storageMode = process.env.WEBHOOK_TARGETS_STORAGE || 'memory'
    const storagePath = process.env.WEBHOOK_TARGETS_PATH
    this.storage =
      storageMode === 'file'
        ? new FileTargetsStorage(storagePath)
        : storageMode === 'db'
        ? new DbTargetsStorage()
        : new MemoryTargetsStorage()
    this.storage.load().then(items => {
      if (Array.isArray(items) && items.length) this.targets = items
    })
    const preset = process.env.WEBHOOK_DEFAULT_TARGETS
    if (preset) {
      try {
        const items = JSON.parse(preset)
        if (Array.isArray(items)) {
          for (const i of items) {
            if (i && typeof i.url === 'string') this.targets.push({ url: i.url, secret: i.secret })
          }
          this.storage.save(this.targets)
        }
      } catch {}
    }
    this.consume()
  }

  async register(url: string, secret?: string) {
    this.targets.push({ url, secret })
    await this.storage.save(this.targets)
    return { url }
  }

  list() {
    return this.targets
  }

  async remove(url: string) {
    this.targets = this.targets.filter(t => t.url !== url)
    await this.storage.save(this.targets)
    return { ok: true }
  }

  async enqueue(event: WebhookEvent) {
    await this.queue.push(JSON.stringify(event))
    if (this.metrics) this.metrics.enqueuedTotal.inc()
  }

  private consume() {
    this.queue.consume(async msg => {
      const event: WebhookEvent = JSON.parse(msg)
      for (const t of this.targets) {
        const headers: Record<string, string> = {}
        if (t.secret) {
          const h = crypto.createHmac('sha256', t.secret)
          h.update(JSON.stringify(event))
          headers['x-webhook-signature'] = h.digest('hex')
        }
        try {
          await axios.post(t.url, event, { headers, timeout: 10000 })
          if (this.metrics) this.metrics.deliveriesTotal.inc()
        } catch (e) {
          if (this.metrics) this.metrics.deliveryErrorsTotal.inc()
          throw e
        }
      }
    })
  }

  async onModuleDestroy() {
    if ('stop' in this.queue && typeof (this.queue as any).stop === 'function') {
      ;(this.queue as any).stop()
    }
  }
}
