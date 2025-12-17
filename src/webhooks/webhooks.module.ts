import { Module } from '@nestjs/common'
import { WebhooksService } from './webhooks.service.js'
import { WebhooksController } from './webhooks.controller.js'
import { ConfigModule } from '../config/config.module.js'
import { MetricsModule } from '../metrics/metrics.module.js'

@Module({
  imports: [ConfigModule, MetricsModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
  exports: [WebhooksService]
})
export class WebhooksModule {}
