resource "aws_s3_bucket" "cloudvault" {
  bucket_prefix = "cloudvault-"

  tags = {
    Name    = "CloudVault"
    Project = "CloudVault"
  }
}