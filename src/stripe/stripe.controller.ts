import { Controller, Headers, Post, Req } from '@nestjs/common'
import { WebhooksService } from '../webhooks/webhooks.service.js'
import Stripe from 'stripe'
import type { Request } from 'express'

@Controller('stripe')
export class StripeController {
  constructor(private readonly webhooks: WebhooksService) {}

  @Post('webhook')
  async webhook(@Req() req: Request, @Headers('stripe-signature') signature?: string) {
    const secret = process.env.STRIPE_SIGNING_SECRET
    if (secret && signature) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' })
      try {
        const event = stripe.webhooks.constructEvent(req.body as Buffer, signature, secret)
        await this.webhooks.enqueue({ source: 'stripe', payload: event })
        return { ok: true }
      } catch (_e) {
        return { ok: false }
      }
    } else {
      await this.webhooks.enqueue({ source: 'stripe', payload: req.body })
      return { ok: true }
    }
  }
}
