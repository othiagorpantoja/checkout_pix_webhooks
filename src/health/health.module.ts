import { Module } from '@nestjs/common'
import { HealthController } from './health.controller.js'
import { WebhooksModule } from '../webhooks/webhooks.module.js'

@Module({
  imports: [WebhooksModule],
  controllers: [HealthController]
})
export class HealthModule {}
