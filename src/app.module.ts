import { Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module.js'
import { PixModule } from './pix/pix.module.js'
import { WebhooksModule } from './webhooks/webhooks.module.js'
import { StripeModule } from './stripe/stripe.module.js'
import { HealthModule } from './health/health.module.js'
import { MetricsModule } from './metrics/metrics.module.js'

@Module({
  imports: [ConfigModule, PixModule, WebhooksModule, StripeModule, HealthModule, MetricsModule]
})
export class AppModule {}
