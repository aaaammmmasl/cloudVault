data "aws_caller_identity" "current" {}

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

resource "aws_iam_instance_profile" "cloudvault" {
  name = "CloudVault-EC2-Instance-Profile"
  role = aws_iam_role.cloudvault_ec2.name
}

resource "aws_iam_role_policy_attachment" "cloudvault_ssm" {
  role       = aws_iam_role.cloudvault_ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com"
  ]

  tags = {
    Name    = "GitHub-Actions-OIDC"
    Project = "CloudVault"
  }
}

resource "aws_iam_role" "github_actions" {
  name = "CloudVault-GitHub-Actions-Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }

        Action = "sts:AssumeRoleWithWebIdentity"

        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }

          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:aaaammmmasl/cloudVault:ref:refs/heads/main"
          }
        }
      }
    ]
  })

  tags = {
    Name    = "CloudVault-GitHub-Actions-Role"
    Project = "CloudVault"
  }
}

resource "aws_iam_role_policy" "github_actions_ssm" {
  name = "CloudVault-GitHub-Actions-SSM"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "SendDeploymentCommand"
        Effect = "Allow"

        Action = [
          "ssm:SendCommand"
        ]

        Resource = [
          "arn:aws:ec2:${var.aws_region}:${data.aws_caller_identity.current.account_id}:instance/${aws_instance.cloudvault.id}",
          "arn:aws:ssm:${var.aws_region}::document/AWS-RunShellScript"
        ]
      },

      {
        Sid    = "CheckDeploymentCommand"
        Effect = "Allow"

        Action = [
          "ssm:GetCommandInvocation"
        ]

        Resource = "*"
      }
    ]
  })
}