import { Module } from '@nestjs/common'
import { PixController } from './pix.controller.js'
import { PixService } from './pix.service.js'
import { ConfigModule } from '../config/config.module.js'
import { WebhooksModule } from '../webhooks/webhooks.module.js'

@Module({
  imports: [ConfigModule, WebhooksModule],
  controllers: [PixController],
  providers: [PixService]
})
export class PixModule {}
