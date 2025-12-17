variable "region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "prefix" {
  type        = string
  description = "Resource name prefix"
  default     = "checkout-pix-webhooks"
}
