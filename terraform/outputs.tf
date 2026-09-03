output "ec2_instance_id" {
  description = "ID of the CloudVault EC2 instance"
  value       = aws_instance.cloudvault.id
}

output "ec2_public_ip" {
  description = "Public IP address of the CloudVault EC2 instance"
  value       = aws_instance.cloudvault.public_ip
}

output "s3_bucket_name" {
  description = "Name of the CloudVault S3 bucket"
  value       = aws_s3_bucket.cloudvault.id
}