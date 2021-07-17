terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  profile    = "default"
  region     = var.AWS_REGION
  access_key = var.ACCESS_KEY_ID
  secret_key = var.SECRET_ACCESS_KEY
}

resource "aws_db_instance" "database" {
  tags = {
    Name = "Exchange Database - RDS Instance."
  }

  identifier        = "exchange-database"
  allocated_storage = 20
  storage_type      = "gp2"
  engine            = "mysql"
  engine_version    = "8.0.25"
  instance_class    = "db.t3.micro"

  name     = var.MYSQL_DATABASE
  username = var.MYSQL_USER
  password = var.MYSQL_PASSWORD

  parameter_group_name = "default.mysql8.0"
  publicly_accessible  = true
  # deletion_protection = true
  skip_final_snapshot    = true
  vpc_security_group_ids = [aws_security_group.security-group.id]

  provisioner "local-exec" {
    command = templatefile("${path.module}/rds_local-exec.sh", { address = self.address, port = self.port, username = self.username, password = self.password })
  }
}

resource "aws_instance" "backend" {
  tags = {
    Name = "Exchange Microservice backend server - EC2 Instance."
  }
  ami           = var.EC2_AMI
  instance_type = "t2.medium"
  # key_name        = aws_key_pair.deployer.key_name

  user_data = templatefile("${path.module}/ec2_user_data.sh", { repo : var.GH_REPO,
    mysql_root_password : var.MYSQL_ROOT_PASSWORD,
    mysql_user : var.MYSQL_USER,
    mysql_password : var.MYSQL_PASSWORD,
    jwt_secret : var.JWT_SECRET,
    mysql_database : var.MYSQL_DATABASE,
    database_uri : aws_db_instance.database.address
  })

  # security_groups = [aws_security_group.security-group.name]
  vpc_security_group_ids = [aws_security_group.security-group.id]
  # depends_on = [aws_db_instance.database]
}

resource "aws_s3_bucket" "frontend" {
  tags = {
    Name = "Exchange Microservice frontend - S3 Bucket."
  }
  
  force_destroy = true
  bucket = var.BUCKET_NAME
  acl    = "public-read"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT", "DELETE", "HEAD"] // Allowing all methods is unsercure
    allowed_origins = ["http://${aws_instance.backend.public_dns}"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  versioning {
    enabled = true
  }

  logging {
    target_bucket = aws_s3_bucket.exchange_frontend_log_bucket.id
    target_prefix = "log/"
  }

  policy = templatefile("${path.module}/policy.json", { bucket_name : var.BUCKET_NAME })

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  provisioner "local-exec" {
    command = templatefile("${path.module}/s3_local-exec.sh", { backend_uri : aws_instance.backend.public_dns, bucket_name : var.BUCKET_NAME })
  }
}

resource "aws_s3_bucket" "exchange_frontend_log_bucket" {
  bucket = "exchange-frontend-log-bucket"
  acl    = "log-delivery-write"
  force_destroy = true
}

resource "aws_security_group" "security-group" {
  name        = "Exposes all ports (unsecure)"
  description = "Exposes all ports (unsecure)"

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# resource "aws_key_pair" "deployer" {
#   key_name   = "deployer-key"
#   public_key = file("./id_rsa.pub")
# }
