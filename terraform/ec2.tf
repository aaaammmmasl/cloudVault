resource "aws_instance" "cloudvault" {
  ami           = "ami-01d5faff4584de9de"
  instance_type = "t3.micro"

  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.cloudvault.id]
  associate_public_ip_address = true

  iam_instance_profile = aws_iam_instance_profile.cloudvault.name

  tags = {
    Name    = "CloudVault-EC2"
    Project = "CloudVault"
  }
}

resource "aws_ssm_association" "cloudwatch_agent" {
  name = "AWS-RunShellScript"

  targets {
    key    = "InstanceIds"
    values = [aws_instance.cloudvault.id]
  }

  parameters = {
    commands = <<-EOT
      set -e

      dnf install -y amazon-cloudwatch-agent

      cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json <<'EOF'
${file("${path.module}/cloudwatch-agent-config.json")}
EOF

      /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
        -a fetch-config \
        -m ec2 \
        -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
        -s
    EOT
  }

  depends_on = [
    aws_iam_role_policy_attachment.cloudvault_cloudwatch_agent
  ]
}