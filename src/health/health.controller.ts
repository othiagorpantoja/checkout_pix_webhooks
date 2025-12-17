import { Controller, Get } from '@nestjs/common'
import { WebhooksService } from '../webhooks/webhooks.service.js'

@Controller('health')
export class HealthController {
  constructor(private readonly webhooks: WebhooksService) {}

  @Get()
  async get() {
    const targets = this.webhooks.list()
    const queue = (this.webhooks as any).queue
    let queueStats: any = {}
    if (queue && 'stats' in queue && typeof queue.stats === 'function') {
      queueStats = queue.stats()
    } else if (queue && 'ping' in queue && typeof queue.ping === 'function') {
      queueStats = await queue.ping()
    }
    return {
      ok: true,
      targets: targets.length,
      queue: queueStats
    }
  }

  @Get('live')
  async live() {
    return { ok: true }
  }

  @Get('ready')
  async ready() {
    const queue = (this.webhooks as any).queue
    let queueStats: any = {}
    if (queue && 'ping' in queue && typeof queue.ping === 'function') {
      queueStats = await queue.ping()
    }
    return { ok: true, queue: queueStats }
  }
}
