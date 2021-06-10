variable "SECRET_KEY" {}
variable "ACCESS_KEY" {}
variable "DB_PASS" {}

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
  name                   = "utentiMicroservice"
  identifier             = "utenti-microservices"
  username               = "admin"
  password               = var.DB_PASS
  parameter_group_name   = "default.mysql8.0"
  port                   = 3306
  publicly_accessible    = true
  skip_final_snapshot    = true
  multi_az               = false
  vpc_security_group_ids = [aws_security_group.db-exchange-sgroup.id]

  provisioner "local-exec" {
    command = "mysql --host=${self.address} --port=${self.port} --user=${self.username} --password=${self.password} < ./db_schema.sql"
  }
}
