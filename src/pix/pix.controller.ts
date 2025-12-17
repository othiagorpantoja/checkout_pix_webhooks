import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { PixService } from './pix.service.js'
import { IsNumber, IsOptional, IsString } from 'class-validator'

class CreateChargeDto {
  @IsNumber()
  amount!: number

  @IsOptional()
  @IsString()
  description?: string
}

@Controller('pix')
export class PixController {
  constructor(private readonly pix: PixService) {}

  @Post('charges')
  async createCharge(@Body() dto: CreateChargeDto) {
    return this.pix.createCharge(dto.amount, dto.description)
  }

  @Get('charges/:id')
  async getCharge(@Param('id') id: string) {
    return this.pix.getCharge(id)
  }

  @Post('webhook')
  async webhook(@Body() payload: any) {
    await this.pix.handleWebhook(payload)
    return { ok: true }
  }
}
