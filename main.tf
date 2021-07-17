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

resource "aws_instance" "container" {
  tags = {
    Name = "First server"
  }
  ami           = var.EC2_AMI
  instance_type = "t2.medium"
  # key_name        = aws_key_pair.deployer.key_name

  user_data = <<-EOF
    #!/bin/bash
    set -ex
    PUBLIC_DNS="$(curl http://169.254.169.254/latest/meta-data/public-hostname 2>/dev/null)"
    sudo yum update -y  
    sudo yum install -y amazon-linux-extras
    sudo yum install -y git
    sudo amazon-linux-extras install docker -y
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    sudo curl -L https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
    cd /var/tmp
    git clone ${var.GH_REPO}
    cd /var/tmp/sf-academy
    echo -e "MYSQL_ROOT_PASSWORD=${var.MYSQL_ROOT_PASSWORD}
    MYSQL_USER=${var.MYSQL_USER}
    MYSQL_PASSWORD=${var.MYSQL_PASSWORD}
    JWT_SECRET=${var.JWT_SECRET}
    MYSQL_DATABASE=${var.MYSQL_DATABASE}
    DATABASE_URI=${aws_db_instance.database.address}
    API_URI=api
    USERS_URI=users
    EXCHANGE_URI=exchange
    FRONTEND_URI=frontend
    REACT_APP_NGINX_URI="$PUBLIC_DNS"\n" >> .env
    docker-compose up --build
  EOF



  # security_groups = [aws_security_group.security-group.name]
  vpc_security_group_ids = [aws_security_group.security-group.id]
  # depends_on = [aws_db_instance.database]
}

# resource "aws_key_pair" "deployer" {
#   key_name   = "deployer-key"
#   public_key = file("./id_rsa.pub")
# }

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
