output "queue_arn" {
  value = aws_sqs_queue.webhooks.arn
}

output "dlq_arn" {
  value = aws_sqs_queue.webhooks_dlq.arn
}
