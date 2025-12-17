import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, SendMessageCommand, GetQueueAttributesCommand } from '@aws-sdk/client-sqs'

type Handler = (message: string) => Promise<void>

export class SqsQueue {
  private client: SQSClient
  private queueUrl: string
  private dlqUrl?: string
  private stopped = false

  constructor(opts: { queueUrl: string; dlqUrl?: string; region: string }) {
    this.client = new SQSClient({ region: opts.region })
    this.queueUrl = opts.queueUrl
    this.dlqUrl = opts.dlqUrl
  }

  async push(message: string) {
    await this.client.send(new SendMessageCommand({ QueueUrl: this.queueUrl, MessageBody: message }))
  }

  consume(handler: Handler) {
    this.loop(handler)
  }

  private async loop(handler: Handler) {
    while (!this.stopped) {
      const res = await this.client.send(
        new ReceiveMessageCommand({
          QueueUrl: this.queueUrl,
          MaxNumberOfMessages: 5,
          WaitTimeSeconds: 20,
          VisibilityTimeout: 30
        })
      )
      const msgs = res.Messages || []
      for (const m of msgs) {
        if (!m.ReceiptHandle || m.Body === undefined) continue
        try {
          await handler(m.Body)
          await this.client.send(new DeleteMessageCommand({ QueueUrl: this.queueUrl, ReceiptHandle: m.ReceiptHandle }))
        } catch (_e) {
          if (this.dlqUrl) {
            await this.client.send(new SendMessageCommand({ QueueUrl: this.dlqUrl, MessageBody: m.Body }))
            await this.client.send(new DeleteMessageCommand({ QueueUrl: this.queueUrl, ReceiptHandle: m.ReceiptHandle }))
          }
        }
      }
    }
  }

  stop() {
    this.stopped = true
  }

  async ping() {
    const attrs = await this.client.send(new GetQueueAttributesCommand({ QueueUrl: this.queueUrl, AttributeNames: ['ApproximateNumberOfMessages'] }))
    return attrs.Attributes || {}
  }
}
