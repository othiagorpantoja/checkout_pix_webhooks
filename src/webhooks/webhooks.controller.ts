import { Body, Controller, Delete, Get, Post } from '@nestjs/common'
import { IsOptional, IsString, IsUrl } from 'class-validator'
import { WebhooksService } from './webhooks.service.js'

class RegisterWebhookDto {
  @IsUrl()
  url!: string

  @IsOptional()
  @IsString()
  secret?: string
}

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooks: WebhooksService) {}

  @Post('register')
  async register(@Body() dto: RegisterWebhookDto) {
    return this.webhooks.register(dto.url, dto.secret)
  }

  @Get()
  list() {
    return this.webhooks.list()
  }

  @Delete('register')
  async remove(@Body() dto: RegisterWebhookDto) {
    return this.webhooks.remove(dto.url)
  }
}
