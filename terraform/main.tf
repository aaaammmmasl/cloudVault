resource "aws_s3_bucket" "cloudvault" {
  bucket_prefix = "cloudvault-"

  tags = {
    Name    = "CloudVault"
    Project = "CloudVault"
  }
}

resource "aws_s3_bucket_versioning" "cloudvault" {
  bucket = aws_s3_bucket.cloudvault.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cloudvault" {
  bucket = aws_s3_bucket.cloudvault.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "cloudvault" {
  bucket = aws_s3_bucket.cloudvault.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}


resource "aws_vpc" "cloudvault" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name    = "CloudVault"
    Project = "CloudVault"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.cloudvault.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name    = "CloudVault-public-subnet"
    Project = "CloudVault"
  }
}

resource "aws_internet_gateway" "cloudvault" {
  vpc_id = aws_vpc.cloudvault.id

  tags = {
    Name    = "CloudVault-igw"
    Project = "CloudVault"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.cloudvault.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.cloudvault.id
  }

  tags = {
    Name    = "CloudVault-public-route-table"
    Project = "CloudVault"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "cloudvault" {
  name        = "cloudvault-sg"
  description = "Security group for CloudVault EC2"
  vpc_id      = aws_vpc.cloudvault.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "CloudVault-SG"
    Project = "CloudVault"
  }
}