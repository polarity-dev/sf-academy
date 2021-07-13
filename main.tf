terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = var.AWS_REGION
  access_key = var.ACCESS_KEY_ID
  secret_key = var.SECRET_ACCESS_KEY
}

resource "aws_db_instance" "database" {
  identifier = "exchange-database"
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "8.0.25"
  instance_class       = "db.t3.micro"

  name                 = var.MYSQL_DATABASE
  username             = var.MYSQL_USER
  password             = var.MYSQL_PASSWORD

  parameter_group_name = "default.mysql8.0"
  publicly_accessible = true
  # deletion_protection = true
  skip_final_snapshot  = true
  vpc_security_group_ids = [aws_security_group.security-group.id]

  tags = {
    Name = "Exchange Database RDS Instance"
  }

  provisioner "local-exec" {
    command = "mysql --host=${self.address} --port=${self.port} --user=${self.username} --password=${self.password} < ddl_schema.sql"
  }
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
