import { Controller, Get } from '@nestjs/common'
import { MetricsService } from './metrics.service.js'

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  async get() {
    return this.metrics.metrics()
  }
}
