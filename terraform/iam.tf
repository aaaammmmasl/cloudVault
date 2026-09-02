resource "aws_iam_policy" "cloudvault_s3" {
  name        = "CloudVault-S3-Access"
  description = "Allow CloudVault EC2 to manage objects in the CloudVault S3 bucket"

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]

        Resource = "${aws_s3_bucket.cloudvault.arn}/*"
      }
    ]
  })
}

resource "aws_iam_role" "cloudvault_ec2" {
  name = "CloudVault-EC2-Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ec2.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name    = "CloudVault-EC2-Role"
    Project = "CloudVault"
  }
}

resource "aws_iam_role_policy_attachment" "cloudvault_s3" {
  role       = aws_iam_role.cloudvault_ec2.name
  policy_arn = aws_iam_policy.cloudvault_s3.arn
}