variable "EC2_AMI" {
  description = "Amazon Machine Images (Amazon Linux 2 AMI (HVM), SSD Volume Type)"
  type        = string
  default     = "ami-062fdd189639d3e93"
}

variable "BUCKET_NAME" {
  description = "S3 Bucket name for React Frontend"
  type        = string
  default     = "exchange-microservice-frontend-s3-bucket"
}

variable "AWS_REGION" {
  description = "AWS region"
  type        = string
  default     = "eu-west-3"
}

variable "ACCESS_KEY_ID" {
  description = "AWS access key ID"
  type        = string
  sensitive   = true
}

variable "SECRET_ACCESS_KEY" {
  description = "AWS access key secret"
  type        = string
  sensitive   = true
}

variable "GH_REPO" {
  description = "GitHub repo to clone"
  type        = string
  default     = "https://github.com/nilaerdna/sf-academy.git"
}

variable "MYSQL_ROOT_PASSWORD" {
  description = "AWS RDS Database root password"
  type        = string
  sensitive   = true
}

variable "MYSQL_USER" {
  description = "AWS RDS Database username"
  type        = string
  sensitive   = true
}

variable "MYSQL_PASSWORD" {
  description = "AWS RDS Database user password"
  type        = string
  sensitive   = true
}

variable "JWT_SECRET" {
  description = "JSON Web Token Secret"
  type        = string
  sensitive   = true
}

variable "MYSQL_DATABASE" {
  description = "AWS RDS Database name"
  type        = string
  default     = "exchange_microservice_database"
  sensitive   = true
}

# variable "DATABASE_URI" {
#   description = "URI for Database"
#   type        = string
#   default     = aws_db_instance.database.address
#   sensitive   = true
# }

# variable "USERS_URI" {
#   description = "URI for Users"
#   type        = string
#   default   = aws_instance.container.public_dns
#   sensitive   = true
# }

# variable "EXCHANGE_URI" {
#   description = "URI for Exchange"
#   type        = string
#   default   = aws_instance.container.public_dns
#   sensitive   = true
# }

# variable "API_URI" {
#   description = "URI for API"
#   type        = string
#   default   = aws_instance.container.public_dns
#   sensitive   = true
# }

# variable "NGINX_URI" {
#   description = "URI for NGINX"
#   type        = string
#   default   = aws_instance.container.public_dns
#   sensitive   = true
# }
