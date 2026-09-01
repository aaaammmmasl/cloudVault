variable "aws_region" {
  description = "AWS region where CloudVault infrastructure will be created"
  type        = string
  default     = "eu-north-1"
}

data "aws_availability_zones" "available" {
  state = "available"
}