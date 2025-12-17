import { Injectable } from '@nestjs/common'
import { PixProvider } from './providers/pix-provider.interface.js'
import { MockPixProvider } from './providers/mock-pix.provider.js'
import { WebhooksService } from '../webhooks/webhooks.service.js'

@Injectable()
export class PixService {
  private provider: PixProvider

  constructor(private readonly webhooks: WebhooksService) {
    this.provider = new MockPixProvider()
  }

  async createCharge(amount: number, description?: string) {
    const charge = await this.provider.createCharge(amount, description)
    return charge
  }

  async getCharge(id: string) {
    return this.provider.getCharge(id)
  }

  async handleWebhook(payload: any) {
    await this.webhooks.enqueue({ source: 'pix', payload })
  }
}
