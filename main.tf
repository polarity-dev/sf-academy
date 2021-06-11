variable "SECRET_KEY" {}
variable "ACCESS_KEY" {}
variable "DB_PASS" {}
variable "JWT_SECRET" {}
variable "DB_NAME" {}
variable "DB_PORT" {}
variable "DB_USER" {}

provider "aws" {
  access_key = var.ACCESS_KEY
  secret_key = var.SECRET_KEY
  region     = "eu-central-1"
}


resource "aws_security_group" "db-exchange-sgroup" {
  name        = "db-exchange-services"
  description = "security group for database exchange service"


  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "exchange-database" {
  allocated_storage      = 20
  storage_type           = "gp2"
  engine                 = "mysql"
  engine_version         = "8.0.16"
  instance_class         = "db.t2.micro"
  name                   = var.DB_NAME
  identifier             = "utenti-microservices"
  username               = var.DB_USER
  password               = var.DB_PASS
  parameter_group_name   = "default.mysql8.0"
  port                   = var.DB_PORT
  publicly_accessible    = true
  skip_final_snapshot    = true
  multi_az               = false
  vpc_security_group_ids = [aws_security_group.db-exchange-sgroup.id]

  provisioner "local-exec" {
    command = "mysql --host=${self.address} --port=${self.port} --user=${self.username} --password=${self.password} < ./db_schema.sql"
  }
}


resource "aws_security_group" "exchange-sgroup" {
  name        = "exchange-service"
  description = "exchange-service"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "time_sleep" "wait_30_seconds" {
  depends_on      = [aws_db_instance.exchange-database]
  create_duration = "30s"
}

variable "key_name" {
  default = "chiavi_"
}

resource "tls_private_key" "example" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "generated_key" {
  key_name   = var.key_name
  public_key = tls_private_key.example.public_key_openssh
}


output "rds_address" {
  value = aws_db_instance.exchange-database.endpoint
}


resource "aws_instance" "exchange-services" {

  depends_on      = [time_sleep.wait_30_seconds]
  ami             = "ami-043097594a7df80ec"
  instance_type   = "t2.micro"
  security_groups = [aws_security_group.exchange-sgroup.name]
  key_name        = aws_key_pair.generated_key.key_name

  tags = {
    Name = "exchange-services"
  }

  provisioner "file" {
    source      = "./EC2Config/docker-composeEC2.yml"
    destination = "/tmp/docker-compose.yml"
    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = tls_private_key.example.private_key_pem
      host        = self.public_ip
    }
  }

  provisioner "file" {
    source      = "./EC2Config/default.conf"
    destination = "/tmp/default.conf"
    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = tls_private_key.example.private_key_pem
      host        = self.public_ip
    }
  }


  provisioner "file" {
    source      = "./proto"
    destination = "/tmp/proto"

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = tls_private_key.example.private_key_pem
      host        = self.public_ip
    }
  }

  user_data = <<-EOF
            #! /bin/bash
            export JWT_SECRET=${var.JWT_SECRET}
            export DB_URI=mysql://${var.DB_USER}:${var.DB_PASS}@${aws_db_instance.exchange-database.endpoint}/${var.DB_NAME}
            sudo yum update -y
            sudo yum install docker -y
            sudo service docker start
            sudo usermod -a -G docker ec2-user
            sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
            cd /tmp/
            docker-compose up --build
        EOF

}

output "ec2_address" {
  value = aws_instance.exchange-services.public_dns
}

variable "bucket_name" {
  default = "exchangeapp"
}

resource "aws_s3_bucket" "er_secchio" {
  bucket        = var.bucket_name
  acl           = "public-read"
  force_destroy = true
  versioning {
    enabled = true
  }


  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD", "PUT", "POST"]
    allowed_origins = ["http://${aws_instance.exchange-services.public_dns}"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  policy = <<EOF
{
  "Id": "bucket_policy_site",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "bucket_policy_site_main",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${var.bucket_name}/*",
      "Principal": "*"
    }
  ]
}
EOF

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  provisioner "local-exec" {
    command = "cd web && set REACT_APP_ADDRESS=${aws_instance.exchange-services.public_dns} && npm run build && aws s3 sync ./build  s3://${var.bucket_name}"
  }
}

output "website_endpoint" {
  value = aws_s3_bucket.er_secchio.website_endpoint
}
