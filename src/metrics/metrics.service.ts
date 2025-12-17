import { Injectable } from '@nestjs/common'
import { collectDefaultMetrics, Counter, Gauge, register } from 'prom-client'

@Injectable()
export class MetricsService {
  deliveriesTotal: Counter
  deliveryErrorsTotal: Counter
  enqueuedTotal: Counter
  dlqTotal: Gauge

  constructor() {
    collectDefaultMetrics()
    this.deliveriesTotal = new Counter({ name: 'webhook_deliveries_total', help: 'Total de entregas de webhooks' })
    this.deliveryErrorsTotal = new Counter({ name: 'webhook_delivery_errors_total', help: 'Total de erros de entrega' })
    this.enqueuedTotal = new Counter({ name: 'webhook_enqueued_total', help: 'Total de eventos enfileirados' })
    this.dlqTotal = new Gauge({ name: 'webhook_dlq_total', help: 'Mensagens na DLQ (estimado)' })
  }

  async metrics() {
    return register.metrics()
  }
}
