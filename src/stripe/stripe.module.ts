import { Module } from '@nestjs/common'
import { StripeController } from './stripe.controller.js'
import { WebhooksModule } from '../webhooks/webhooks.module.js'

@Module({
  imports: [WebhooksModule],
  controllers: [StripeController]
})
export class StripeModule {}
