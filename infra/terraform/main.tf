terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_sqs_queue" "webhooks_dlq" {
  name                       = "${var.prefix}-dlq"
  message_retention_seconds  = 1209600
}

resource "aws_sqs_queue" "webhooks" {
  name                       = "${var.prefix}-queue"
  visibility_timeout_seconds = 30
  redrive_policy             = jsonencode({ deadLetterTargetArn = aws_sqs_queue.webhooks_dlq.arn, maxReceiveCount = 5 })
}

output "queue_url" {
  value = aws_sqs_queue.webhooks.id
}

output "dlq_url" {
  value = aws_sqs_queue.webhooks_dlq.id
}
